import { Component } from '@angular/core';
import { Paho } from 'ng2-mqtt/mqttws31';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  status = "Fechado";
  client: Paho.MQTT.Client;
  message = new Paho.MQTT.Message("acionar");
  recebi = 0;

  btnDisabled = false;

  loader;

  constructor(public loadingController: LoadingController) {

    this.presentLoading();

    var iframe = document.getElementById('youriframe');
  
    this.client = new Paho.MQTT.Client("m15.cloudmqtt.com", 30331, "EGv22123235233");
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived.bind(this);

    this.client.connect({ useSSL: true, userName: "hedhmutk", password: "dsUHVnol39qg", onSuccess: this.onConnect.bind(this) });

  }

  async presentLoading() {
    this.loader = await this.loadingController.create({
      message: 'Loading',
      duration: 1000
    });
    await this.loader.present();
  }

  async aciona() {
    this.btnDisabled = true;
    this.message.destinationName = "EG_acao_portao";
    this.client.send(this.message);
  }

  doRefresh(event) {
    console.log('Begin async operation');

    window.location.reload();

    event.target.complete();
    
  }

  onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Connected :)))");
    this.client.subscribe("recebi", { qos: 0 });
    this.client.subscribe("status_portao", { qos: 0 });
    //var message = new Paho.MQTT.Message("Hello CloudMQTT");
    //message.destinationName = "/EGWebsocket20031218";
    //this.client.send(message);
  }

  doFail(e) {
    console.log(e);
  }

  // called when the client loses its connection
  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  // called when a message arrives
  async onMessageArrived(message) {
    if (message.destinationName.indexOf('recebi') !== -1) {
      this.recebi = message.payloadString;
      console.log(this.recebi);
      if (this.recebi == 1) {
        this.btnDisabled = false;


      }
    }


    if (message.destinationName.indexOf('status_portao') !== -1) {
      if (message.payloadString == 1) {
        console.log("Aberto");
        this.status = "Aberto";
      } else if (message.payloadString == 0) {
        {
          console.log("Fechado");
          this.status = "Fechado";
        }
      }
    }
  }

}
