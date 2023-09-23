import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountTiersService {


  postNewCosCommTiers(newTerritoryId, newTier, newTierYear, newTierPercent) {
    const obj = {
      'territory_id' : newTerritoryId,
      'tier' : newTier,
      'tier_year' : newTierYear,
      'tier_percent' : newTierPercent,
      'mode': 'upload'
    }
    return this.http.post('https://a2i5yg3l69.execute-api.us-east-1.amazonaws.com/staging/post-cb2b-coscommtiers',
    obj)  
  }

  updateCosCommTiers(newTerritoryId, newTier, newTierYear, newTierPercent) {
    const obj = {
      'territory_id' : newTerritoryId,
      'tier' : newTier,
      'tier_year' : newTierYear,
      'tier_percent' : newTierPercent,
      'mode' : 'update'
    }
    return //--REMOVED FOR SECURITY PURPOSES
  
  }

  deleteCosCommTiers(newTerritoryId, newAccYear, newTier){
    const obj = {
      'territory_id' : newTerritoryId,
      'tier' : newTier,
      'tier_year' : newAccYear,
      'mode' : 'delete'
    }
    return //--REMOVED FOR SECURITY PURPOSES
  }


  getCosCommTiers() {
    return //--REMOVED FOR SECURITY PURPOSES
  }

  
  constructor(private http: HttpClient) { }
}
