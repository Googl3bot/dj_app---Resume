import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesGoalsUploadService {


  postNewSalesGoal(accountingYear, accountingMonth, salesGoal, territoryId) {
    const obj = {
      'acc_year': accountingYear,
      'acc_month': accountingMonth,
      'sales_goal': salesGoal,
      'territory_id': territoryId,
      'mode': 'upload'
    }
    return //--REMOVED FOR SECURITY PURPOSES

  }

  updateSalesGoal(accountingYear, accountingMonth, salesGoal, territoryId) {
    const obj = {
      'acc_year': accountingYear,
      'acc_month': accountingMonth,
      'sales_goal': salesGoal,
      'territory_id': territoryId,
      'mode': 'update'
    }
    return //--REMOVED FOR SECURITY PURPOSES
  }

  getSalesGoals() {
    return //--REMOVED FOR SECURITY PURPOSES
  }

  deleteSalesGoal(entryId) {
    const obj = {
      'entry_id': entryId,
      'mode': 'delete'
    }
    return //--REMOVED FOR SECURITY PURPOSES
  }

  constructor(private http: HttpClient) { }
}
