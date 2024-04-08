import { XMLParser } from 'fast-xml-parser';
import type { TaxData, Taxpayer } from '../../types/taxpayer';

export function parseTaxData(xmlData: string): TaxData {
	const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
	const json = parser.parse(xmlData);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const taxpayers: Taxpayer[] = json.tifs.taxpayer.map((taxpayer: any) => ({
		id: taxpayer['@_id'],
		company: taxpayer.company,
		street: taxpayer.street,
		city: taxpayer.city,
		country: taxpayer.country,
		tax: parseFloat(taxpayer.tax)
	}));

	return { taxpayers };
}
