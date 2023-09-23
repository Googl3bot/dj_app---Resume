import { Component, OnInit } from '@angular/core';

import { Action } from 'src/app/classes/ecommerce/dashboard/action';
import * as constants from '../../constants'
import { DashboardService } from 'src/app/services/ecommerce/dashboard/dashboard.service';
import { StatusService } from 'src/app/services/status.service';
import { StorageService } from 'src/app/services/storage.service';
import { ReportingService } from 'src/app/services/reporting.service';

@Component({
  selector: 'app-cosmedix-reporting',
  templateUrl: './cosmedix-reporting.component.html',
  styleUrls: ['./cosmedix-reporting.component.scss']
})
export class CosmedixReportingComponent implements OnInit {

  spinner = constants.spinner
  year: string = ''
  mailingList




  constructor(private service: ReportingService, private status: StatusService, private storage: StorageService) { }

  actions = [
    new Action(
      'Cosmedix Sales By Month By Admin/Customer',
      'Retrieve sales totals for each month for a given year in order to determine the number of sales by admin vs customer placed.',
      'getCosmedixSalesByAdminReport',
      [{
        type: 'number',
        name: 'year',
        placeholder: 'Enter year: YYYY',
        required: true,
        value: ''
      }],
      [
        {
          type: 'submit',
          icon: 'cloud_download',
          spinner: constants.spinner,
          active: false
        }
      ]
    )
  ]

  run(name) {
    this[name]()
  }

  downloadActive = false
  getCosmedixSalesByAdminReport() {
    // only start the download if a download is not active
    const actionIndex = this.actions.findIndex(action => action.submit == 'getCosmedixSalesByAdminReport')
    const actionSubmitIndex = this.actions[actionIndex].buttons.findIndex(button => button.type == 'submit')

    if (!this.actions[actionIndex].buttons[actionSubmitIndex].active) {
      this.status.show('Your download has started. Please wait')
      this.actions[actionIndex].buttons[actionSubmitIndex].active = true
      
      
      this.service.getCosmedixSalesByAdminReport(this.actions[actionIndex].inputs[0].value).then(
        res => {
          if (res['url']) {
            this.actions[actionIndex].inputs[0].value = ''
            const url = res['url']
            window.open(url);
            this.actions[actionIndex].buttons[actionSubmitIndex].active = false
            this.status.setText(`Your download has finished. Please check your Downloads folder for your file. If your download was unsuccessful, try this link:\n ${url}`)
            setTimeout(() => {
              this.status.hide()
            }, 4000);
          }
        }
      )


    }
  }

  subscriptions() {

  }

  ngOnInit(): void {
  }

}
