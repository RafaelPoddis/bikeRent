import { Client } from './client';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const faker = require("@faker-js/faker")

faker.locale = "pt_BR"

export class Bike {
    constructor(
        public name: string,
        public type: string,
        public bodySize: number,
        public maxLoad: number,
        public rate: number,
        public description: string,
        public ratings: number,
        public imageUrls: string[],
        public available: boolean = true,
		public location?: string,
        public id?: string
    ) {}
}
