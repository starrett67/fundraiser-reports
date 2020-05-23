const csvParse = require('csv-parse')
const fs = require('fs').promises

export default class SkuProfits {
  constructor(csvFilePath) {
    this.csvFilePath = csvFilePath
    this.profitMap = new Map()
    this.errors = []
    this.requiredHeaders = [ "sku", "profit" ]
    this.success = []
  }

  parseCsvString(fileString) {
    return new Promise((resolve, reject) => {
      csvParse(fileString, { columns: true }, (err, output) => {
        if (err) reject(err)
        resolve(output)
      })
    })
  }

  getSuccssMessages() {
    this.success.push(`Found ${this.profitMap.size} skus`)
  }

  validateHeaders(order) {
    this.requiredHeaders.forEach(key => {
      if (!order[key]) {
        this.errors.push(`Missing required header: ${key}`)
      }
    })
  }

  async parseSkuProfits() {
    const fileString = await fs.readFile(this.csvFilePath, { encoding: 'utf-8' })
    this.errors = []
    this.csv = await this.parseCsvString(fileString)
    this.validateHeaders(this.csv[0])
    if (this.errors.length === 0) {
      this.csv.forEach(sku => this.profitMap.set(sku.sku, sku.profit))
      this.getSuccssMessages()
    }
  }
}

