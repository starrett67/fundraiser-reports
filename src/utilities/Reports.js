const path = require('path')
const stringify = require('csv-stringify')
const fs = require('fs').promises

export default class Reports {
  constructor(orders, outputPath) {
    this.orders = orders
    this.outputPath = outputPath
    this.orgs = []
    this.members = []

    this.orders.forEach(order => {
      if (!this.orgs.includes(order.org)) this.orgs.push(order.org)
      if (!this.members.includes(order.normalizedName)) this.members.push(order.normalizedName)
    })
  }

  csvStringify(obj) {
    return new Promise((resolve, reject) => {
      stringify(obj, { header: true }, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  async saveFile(orders, path) {
    const memberMap = new Map()
    const memberProfit = []
    orders.forEach(order => {
      if(memberMap.has(order.normalizedName)) {
        let profit = memberMap.get(order.normalizedName)
        profit += order.profit
        memberMap.set(order.normalizedName, profit)
      } else {
        memberMap.set(order.normalizedName, order.profit)
      }
    })
    memberMap.forEach((profit, name) => {
      memberProfit.push({
        member: name,
        amount: profit
      })
    })
    const csvString = await this.csvStringify(memberProfit)
    fs.writeFile(path, csvString)
  }

  async saveFiles() {
    this.orgs.forEach(org => {
      let orders = []
      let filePath = path.join(this.outputPath, `fundraiser-report-${org}.csv`)
      this.orders.forEach(order => {
        if (order.org === org) {
          orders.push(order)
        }
      })
      this.saveFile(orders, filePath)
    })
  }
}
