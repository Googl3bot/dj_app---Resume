import { Component, OnInit, ViewChild } from '@angular/core';
import { SalesGoalsUploadService } from '../sales-goals-upload.service';
import { AccountTiersService } from '../account-tiers.service';
import * as constants from 'src/app/constants'; // get spinner
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-account-tiers',
  templateUrl: './account-tiers.component.html',
  styleUrls: ['./account-tiers.component.scss']
})
export class AccountTiersComponent implements OnInit {

salesGoals;
cosCommTiers;
repLoaded: Promise<boolean>;
spinner = constants.spinner;
info = 'This allows the display, edit, and upload of COS B2B New Account Tiers'; // TODO
// bools - new sales goal
createNewAccountTierToggled;
creatingNewAccountTier;
// New sales goal vals
newTerritoryId;
newTier;
newTierPercent;
newTierYear;
selectedTerritoryId;
selectedTerritory;
// Track table values
editAmtToggles = [];
uploadingToggles = [];
deletingToggles = [];
amts = {};

terrSet;

// file upload
file;
fileContents;

searchInput: any;

tableSrc;
tableHeaders: string[] = [];
currentSalesGoals: any[];
territoryMapping;

@ViewChild(MatSort) sort: MatSort;

@ViewChild(MatPaginator) paginator: MatPaginator;
constructor(private salesGoalUploadService: SalesGoalsUploadService, private accountTiersService: AccountTiersService) { }


/**
 *
 * @param newTerritoryId
 * @param newTier
 * @param newTierYear
 * @param newTierPercent
 * @param i
 */
updateCosCommTiers( newTerritoryId, newTierYear, newTier, newTierPercent, i) {
  if (!isNaN(newTierPercent)) {
    this.uploadingToggles[i] = true;
    // TODO edit
    const newPer = (newTierPercent / 100).toFixed(2);
    this.accountTiersService.updateCosCommTiers(newTerritoryId, newTier, newTierYear, newPer).subscribe(data => {
      this.uploadingToggles[i] = false;
      console.log('Response from Cos Commision Account update: ', data);
      if (data.statusCode != 200) {
        alert(data.message);
      }
      // Refresh table
      this.getCosCommTiersData();
    });
  } else {
    console.log('Passed Tier percent was not a number', newTierPercent);
    alert('Entered Tier percent was not a number. Could not update Tier percent');
  }
}

/**
   * Delete the budget by entry id
   * @param newTerritoryId
   * @param newTierYear
   * @param newTier
   * @param i
   */
 deleteCosCommTiers(newTerritoryId, newTierYear, newTier, i) {
  this.deletingToggles[i] = true;
  this.accountTiersService.deleteCosCommTiers(newTerritoryId, newTierYear, newTier).subscribe(data => {
    this.deletingToggles[i] = false;
    console.log('Response from Cos Commision Tiers delete: ', data);
    if (data.statusCude != 200) {
      alert(data.message);
    }
    // Refresh table
    this.getCosCommTiersData();
  });
}

/**
   * From the values at the top, create new sales goal
   */
 uploadNewCosCommTiers() {
  console.log('Uploading new account Tier: ', this.newTierYear, this.newTier, this.newTierPercent, this.selectedTerritoryId);
  if (isNaN(this.newTierYear) || isNaN(this.newTierPercent)) {
    alert('Please provide year as a number, and tier percent as a decimal');
  } else if (Number.parseInt(this.newTierYear) < 2000) {
    alert('Year provided was not in YYYY format. Please correct and try again.');
  }
  else {
    this.creatingNewAccountTier = true;
    const newPer = (this.newTierPercent / 100).toFixed(2);
    console.log( 'div percentage :', newPer);

    this.accountTiersService.postNewCosCommTiers(this.selectedTerritoryId, this.newTier, this.newTierYear, newPer)
      .subscribe(data => {
        console.log('Response from postNewSalesGoal: ', data);
        this.creatingNewAccountTier = false;
        if (data.statusCode != 200) {
          alert(data.message);
        }
        // Refresh table
        this.getCosCommTiersData();
      });
  }
}

getCosCommTiersData(){
   this.accountTiersService.getCosCommTiers().subscribe(cosCommTiersData => {
    this.tableSrc = new MatTableDataSource<any>();
    console.log('Commission Tiers data from database: ', cosCommTiersData);
    this.cosCommTiers = cosCommTiersData.current_cos_comm_tiers;
    this.territoryMapping = cosCommTiersData.current_territory_mapping;
    for ( let i = 0 ; i < this.cosCommTiers.length ; i++) {
      const item =  this.cosCommTiers[i];
      item.TIER_PERCENT = item.TIER_PERCENT * 100;
    }

    this.tableSrc.data = this.cosCommTiers;

    this.tableHeaders = ['Territory ID', 'Sales Rep', 'Tier Year', 'Tier', 'Tier Percent'];
    // var uiRec = new Array();
    let i = 0;
    this.cosCommTiers.forEach(commTier => {
      // loading data
      this.uploadingToggles.push(false);
      this.deletingToggles.push(false);
      this.editAmtToggles[i] = false;
      this.amts[i] = commTier['Tier Percent'];
      i += 1;
    });
    let territories = [];
    this.cosCommTiers.forEach(commTier => {
      if (!territories.includes(commTier.TERRITORY_ID)) {
        territories.push(commTier.TERRITORY_ID);
      }
    });
    territories = territories.sort((t1, t2) => (t1 - t2));
    this.terrSet = territories;
    // render
    this.repLoaded = Promise.resolve(true);
    // next exec cycle for the material paginator & sort
    setTimeout(() => {
      this.tableSrc.sort = this.sort;
    });
    setTimeout(() => {
      this.tableSrc.paginator = this.paginator;
    });
  }, error => {
console.log('Api call error :', error);
  });
}

toggleNewAccountTiersOpen() {
  this.createNewAccountTierToggled = true;
}

toggleNewAccountTiersClose() {
  this.createNewAccountTierToggled = false;
}

downloadExcel() {
  const downloadTime = new Date().toLocaleDateString();
  this.exportExcel([this.cosCommTiers], 'CB2B CosComm Tiers' + '-' + downloadTime + '.xlsx', ['Mapping']);
}

public exportExcel(superArray: any[], excelFileName: string, sheetNames: string[]) {
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  let i = 0;
  superArray.forEach(ra => {
    // ra is proper json; create a sheet from it
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ra);
    // let nm: string = 'Sheet' + i;
    const nm: string = sheetNames[i];
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
  this.getCosCommTiersData();
}

isToggled(ind) {
  return this.editAmtToggles[ind];
}

downloadTemplate() {
  const rows = [
    ['Territory Id', 'Tier', 'Tier Year', 'Tier Percent'],
    ['1', 'tier_4', '2019', '15']
  ];
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'AccountTiersUploadTemplate.csv');
  document.body.appendChild(link); // Required for FF
  link.click(); // This will download the data file
}

/**
   * When file is provided to input tag, pass file contents
   * to fileContents global var
   * @param event
   */
 fileChanged(event) {
  this.file = event.target.files[0];
  // load file contents to global fileContents
  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    this.fileContents = fileReader.result;
    console.log('this.fileContents', this.fileContents);
  };
  fileReader.readAsText(this.file);
}

submitBatch() {

  console.log('File submitted for upload');

  let row = [];
  let territoryIdIndex = 0;
  let tierYearIndex = 0;
  let tierIndex = 0;
  let tierPercentIndex = 0;
  let newTerritoryId;
  let newTier;
  let newTierYear;
  let newTierPercent;
  let index = 0;
  for (const line of this.fileContents.split('\n')) {
     index++;
     console.log('line', line);
     row = line.split(',');
     if (index === 1 ){
     for (let i = 0; i < row.length; i++) {
       // console.log("index :"+i+" value : "+row[i]);
       if (row[i] === 'Territory Id'){
         territoryIdIndex = i;
       }

       if (row[i] === 'Tier'){
        tierIndex = i;
      }
       if (row[i].trim() === 'Tier Percent'){
        tierPercentIndex = i;
      }
       if (row[i] === 'Tier Year'){
        tierYearIndex = i;
      }
     }
    }else{
      newTerritoryId = row[territoryIdIndex];
      newTierYear = row[tierYearIndex];
      newTierPercent = (row[tierPercentIndex] / 100).toFixed(2);
      newTier = row [tierIndex];
      if (this.checkField(newTerritoryId, newTierYear, newTier, newTierPercent)){
      console.log('call lambda function to update Cos Commision Account tiers => territory Id:' + newTerritoryId + ', Tier :' + newTier + ', tier year:' + newTierYear + ', Tier Percent :' + newTierPercent);
      this.accountTiersService.postNewCosCommTiers(newTerritoryId, newTier, newTierYear.trim(), newTierPercent.trim()).subscribe(data => {
       console.log('Response from Account tier update: ', data);
       if (data.statusCode != 200) {
         console.log(data.message);
       }
     });
      }
    }

   }

}
checkField(territoryId: any, tierYear: any, tier: any, tierPercent: any){{
  if (territoryId === undefined || tierYear === undefined || tier === undefined || tierPercent === undefined){
    return false;
  }
  return true;
}
}

  // search bar filter
  public globalFilter = (value: string) => {
    this.tableSrc.filter = value.trim().toLocaleLowerCase();

  }


ngOnInit(): void {
  this.createNewAccountTierToggled = false;
  // this.getSalesGoalsData()
  this.getCosCommTiersData();
}

}

