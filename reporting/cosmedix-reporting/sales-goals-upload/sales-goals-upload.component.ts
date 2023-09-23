import { Component, OnInit, ViewChild } from '@angular/core';
import { SalesGoalsUploadService } from '../sales-goals-upload.service';
import * as constants from 'src/app/constants'; // get spinner
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-sales-goals-upload',
  templateUrl: './sales-goals-upload.component.html',
  styleUrls: ['./sales-goals-upload.component.scss']
})
export class SalesGoalsUploadComponent implements OnInit {

  salesGoals
  repLoaded: Promise<boolean>
  spinner = constants.spinner;
  info = 'This allows the display, edit, and upload of COS B2B sales goals' // TODO
  // bools - new sales goal
  createNewBudgetToggled
  creatingNewBudget
  // New sales goal vals
  newTerritory
  newAccMonth
  newAccYear
  newSalesGoal
  selectedTerritoryId
  selectedTerritory
  // Track table values 
  editAmtToggles = []
  uploadingToggles = []
  deletingToggles = []
  amts = {}

  terrSet

  searchInput: any;

  tableSrc
  tableHeaders: string[] = []
  currentSalesGoals: any[]
  territoryMapping

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private salesGoalUploadService: SalesGoalsUploadService) { }


  /**
   * From text box provided, update the budget entry
   * @param newTerritory 
   * @param newAccMonth 
   * @param newAccYear 
   * @param newBudgetVal 
   * @param i 
   */
   updateBudget( newTerritory, newAccMonth, newAccYear, newBudgetVal, i) {
    if (!isNaN(newBudgetVal)) {
      this.uploadingToggles[i] = true;
      // TODO edit 
      this.salesGoalUploadService.updateSalesGoal(newAccYear, newAccMonth, newBudgetVal, newTerritory).subscribe(data => {
        this.uploadingToggles[i] = false;
        console.log('Response from budget update: ', data);
        if (data['statusCode'] != 200) {
          alert(data['message'])
        }
        // Refresh table
        this.getSalesGoalsData(); 
      })
    } else {
      console.log("Passed budget was not a number", newBudgetVal);
      alert("Entered budget was not a number. Could not update budget")
    }
  }

  /**
   * Delete the budget by entry id
   * @param entryId 
   * @param i 
   */
  deleteBudget(entryId,i) {
    this.deletingToggles[i] = true;
    this.salesGoalUploadService.deleteSalesGoal(entryId).subscribe(data => {
      this.deletingToggles[i] = false;
      console.log('Response from budget delete: ', data);
      if (data['statusCude'] != 200) {
        alert(data['message'])
      }
      // Refresh table
      this.getSalesGoalsData();
    })
  }

  /**
   * From the values at the top, create new sales goal
   */
  uploadNewSalesGoal() {
    console.log('Uploading new budget: ', this.newAccYear, this.newAccMonth, this.newSalesGoal, this.selectedTerritoryId);
    if (isNaN(this.newAccMonth) || isNaN(this.newAccYear) || isNaN(this.newSalesGoal)) {
      alert("Please provide month as number from 1-12, year as a number, and budget as a number")
    } else if (Number.parseInt(this.newAccMonth) > 12 || Number.parseInt(this.newAccMonth) <= 0) {
      alert("Month provided was not number from 1 - 12. Please correct and try again.")
    } else if (Number.parseInt(this.newAccYear) < 2000) {
      alert("Year provided was not in YYYY format. Please correct and try again.")
    }
    else {
      this.creatingNewBudget = true;
      
      this.salesGoalUploadService.postNewSalesGoal(this.newAccYear, this.newAccMonth, this.newSalesGoal, this.selectedTerritoryId)
        .subscribe(data => {
          console.log("Response from postNewSalesGoal: ", data);
          this.creatingNewBudget = false;
          if (data['statusCode'] != 200) {
            console.log(data['message']);
          }
          // Refresh table
          this.getSalesGoalsData();
        })
    }
  }

  /**
   * Retrieves sales goals and territory mapping data, populating the table 
   */
  getSalesGoalsData() {
    this.salesGoalUploadService.getSalesGoals().subscribe(salesGoalsData => {
      this.tableSrc = new MatTableDataSource<any>();

      console.log('salesGoalsData ', salesGoalsData);
      this.salesGoals = salesGoalsData['current_sales_goals'];
      this.territoryMapping = salesGoalsData['current_territory_mapping'];

      this.tableSrc.data = this.salesGoals;
      
      this.tableHeaders = ['Territory ID', 'Territory', 'Sales Rep', 'Accounting Month', 'Accounting Year',  'Goal'];
      var i = 0;
      this.salesGoals.forEach(cB => {
        // load update toggles
        this.uploadingToggles.push(false)
        this.deletingToggles.push(false)
        this.editAmtToggles[i] = false
        this.amts[i] = cB['goal']
        i += 1;
      })
      // console.log("amts pre-edit: ", this.amts);
      // get distinct set of terrritories
      var territories = []
      this.salesGoals.forEach(cM => {
        if (!territories.includes(cM.territory_id)) {
          territories.push(cM.territory_id)
        }
      })
      territories = territories.sort((t1,t2) =>  (t1 - t2))
      this.terrSet = territories
       // render
       this.repLoaded = Promise.resolve(true);
       // next exec cycle for the material paginator & sort
      setTimeout(() => {
        this.tableSrc.sort = this.sort;
      })
      setTimeout(() => {
        this.tableSrc.paginator = this.paginator;
      })
    });
  }
  
  toggleNewSalesGoalOpen() {
    this.createNewBudgetToggled = true
  }

  toggleNewSalesGoalClose() {
    this.createNewBudgetToggled = false
  }

  downloadExcel() {
    let downloadTime = new Date().toLocaleDateString();
    this.exportExcel([this.salesGoals], "CB2B Sales Goals" + '-' + downloadTime + '.xlsx', ['Mapping']);
  }

  public exportExcel(superArray: any[], excelFileName: string, sheetNames: string[]) {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    let i = 0;
    superArray.forEach(ra => {
      // ra is proper json; create a sheet from it
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ra);
      // let nm: string = 'Sheet' + i;
      let nm: string = sheetNames[i];
      XLSX.utils.book_append_sheet(wb, ws, nm);
      i++;
    });
    // Output the file
    XLSX.writeFile(wb, excelFileName);
  }

  toggleOpen(ind) {
    this.editAmtToggles[ind] = true;
  }

  toggleClose(ind) {
    this.editAmtToggles[ind] = false;
  }

  isToggled(ind) {
    return this.editAmtToggles[ind];
  }

    // search bar filter
    public globalFilter = (value: string) => {
      this.tableSrc.filter = value.trim().toLocaleLowerCase()
  
    }


  ngOnInit(): void {
    this.createNewBudgetToggled = false
    this.getSalesGoalsData()
  }

}
