App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('SoundMoneyCoin.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var SoundMoneyCoinArtifact = data;

      console.log(data);
      App.contracts.SoundMoneyCoin = TruffleContract(SoundMoneyCoinArtifact);

      // Set the provider for our contract.
      App.contracts.SoundMoneyCoin.setProvider(App.web3Provider);

      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#mintButton', App.mint);
  },

  mint: function(event) {
    event.preventDefault();

    console.log('Minting...');

    var SoundMoneyCoinInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.SoundMoneyCoin.deployed().then(function(instance) {
        SoundMoneyCoinInstance = instance;

        return SoundMoneyCoinInstance.mint();
      }).then(function(result) {
        alert('Mint successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function() {
    console.log('Getting balances...');

    var SoundMoneyCoinInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.SoundMoneyCoin.deployed().then(function(instance) {
        SoundMoneyCoinInstance = instance;

        return SoundMoneyCoinInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];

        $('#TTBalance').text(balance / 100000000);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
