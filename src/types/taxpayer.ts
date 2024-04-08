export interface Taxpayer {
	id: string;
	company: string;
	street: string;
	city: string;
	country: string;
	tax: number;
}

export interface TaxData {
	taxpayers: Taxpayer[];
}
