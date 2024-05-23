import { Component, OnInit } from '@angular/core';
import { modelList } from 'src/app/model.config';
import { BleService } from 'src/app/services/ble.service';
import { NoticeService } from 'src/app/services/notice.service';
import { llmModelOptionsUUID, sttModelOptionsUUID, ttsModelOptionsUUID } from 'src/app/configs/ble.config';

@Component({
  selector: 'app-model-config',
  templateUrl: './model-config.page.html',
  styleUrls: ['./model-config.page.scss'],
})
export class ModelConfigPage implements OnInit {

  get llmModelOptions() {
    return this.bleService.dataCache[llmModelOptionsUUID];
  }

  get sttModelOptions() {
    return this.bleService.dataCache[sttModelOptionsUUID];
  }

  get ttsModelOptions() {
    return this.bleService.dataCache[ttsModelOptionsUUID];
  }

  modelConfData: any =
    {
      "llmURL": "",
      "llmModel": "",
      "llmKey": "",
      "llmPrePrompt": "",
      "llmTemp": "",
      "sttURL": "",
      "sttModel": "",
      "sttKey": "",
      "ttsURL": "",
      "ttsModel": "",
      "ttsKey": "",
      "ttsRole": ""
    }


  constructor(
    private bleService: BleService,
    private noticeService: NoticeService
  ) { }

  ngOnInit() {
    console.log('model config init')
    this.bleService.getModelData().then((modelData) => {
      this.modelConfData = modelData;
      console.log("modelConfData: ", this.modelConfData);
    });
    this.bleService.updateRes.subscribe((data) => {
      if (data["type"] === 'aily') {
        this.noticeService.hideLoading();
        if (data["status"] === 1) {
          this.noticeService.showToast('Model setting success');
        } else {
          this.noticeService.showToast('Model setting failed');
        }
      }
    })
  }

  set_llm_model(e) {
    this.modelConfData.llmModel = e.detail.value;
  }

  set_stt_model(e) {
    this.modelConfData.sttModel = e.detail.value;
  }

  set_tts_model(e) {
    console.log("set_tts_model: ", e)
    this.modelConfData.ttsModel = e.detail.value;
  }

  save() {
    this.noticeService.showLoading("Saving...");
  
    if (this.bleService.sendModelData(this.modelConfData)) {
      //
    } else {
      this.noticeService.showToast('error');
    }
  }

}
