const csvParse = require('csv-parse')
const fs = require('fs').promises

export default class Orders {
  constructor(csvFilePath) {
    this.csvFilePath = csvFilePath
    this.orders = new Map()
    this.errors = []
    this.success = []
    this.requiredHeaders = [ "Order ID", "Lineitem sku", "Checkout Form: Organization Code*", "Lineitem quantity" ]
  }

  parseCsvString(fileString) {
    return new Promise((resolve, reject) => {
      csvParse(fileString, { columns: true }, (err, output) => {
        if (err) reject(err)
        resolve(output)
      })
    })
  }

  validateHeaders(order) {
    this.requiredHeaders.forEach(key => {
      if (!order[key]) {
        this.errors.push(`Missing required header: ${key}`)
      }
    })
  }

  getSuccssMessages() {
    const orgs = []
    const members = []
    this.orders.forEach(order => {
      if (!orgs.includes(order.org)) orgs.push(order.org)
      if (!members.includes(order.normalizedName)) members.push(order.normalizedName)
    })
    this.success.push(`Found ${this.orders.size} orders`)
    this.success.push(`Found ${orgs.length} organizations`)
    this.success.push(`Found ${members.length} org members`)
  }

  isNewOrder(order) {
    return order["Checkout Form: Organization Code*"] && order["Checkout Form: Organization Code*"].trim() !== ''
  }

  getOrgCode(order) {
    return order["Checkout Form: Organization Code*"].substring(0, 3).toLowerCase()
  }

  getOrgMember(order) {
    const fullOrgCode = order["Checkout Form: Organization Code*"]
    const name = fullOrgCode.substring(3)
    return name.replace(/[^\w\s]/gi, '').trim().toLowerCase()
  }

  getNormalizedName(order) {
    const fullOrgCode = order["Checkout Form: Organization Code*"]
    return fullOrgCode.replace(/[^\w\s]/gi, '').replace(/ /g, '').trim().toLowerCase()
  }

  parseOrderLine(order) {
    const orderId = order["Order ID"]
    const sku = order["Lineitem sku"]
    const org = this.isNewOrder(order) ? this.getOrgCode(order) : ''
    const quantity = order["Lineitem quantity"]
    const normalizedName = this.isNewOrder(order) ? this.getNormalizedName(order) : ''
    const newOrder = { orderId, lineItems: [{ sku, quantity }], org, normalizedName }
    if (this.orders.has(orderId)) {
      let order = this.orders.get(orderId)
      order.lineItems.push({ sku, quantity })
      this.orders.set(orderId, order)
    } else {
      this.orders.set(orderId, newOrder)
    }
  }

  applyProfits(profitMap) {
    this.orders.forEach(order => {
      let profit = 0
      console.log(order)
      order.lineItems.forEach(item => {
        profit += (item.quantity * profitMap.get(item.sku))
      })
      order.profit = profit
    })
  }

  async parseOrders() {
    const fileString = await fs.readFile(this.csvFilePath, { encoding: 'utf-8' })
    this.errors = []
    this.csv = await this.parseCsvString(fileString)
    this.validateHeaders(this.csv[0])

    if (this.errors.length === 0) {
      this.csv.forEach((order) => this.parseOrderLine(order))
      this.getSuccssMessages()
    }
  }
}
