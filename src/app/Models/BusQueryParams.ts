export class BusQueryParams {
  search?: string;
  fromPlace?: string;
  toPlace?: string;
  busTypeId?: number;
  busCategoryId?: number;
  sortBy: string = 'TravelDate';
  sortDirection: string = 'asc';
  page: number = 1;
  pageSize: number = 3
  fromDate: string = '';
  toDate: string = '';
}
