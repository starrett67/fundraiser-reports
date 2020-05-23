import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import SelectLocalFile from './SelectLocalFile';
import ProcessFiles from './ProcessFiles';
import Orders from './utilities/Orders'
import SkuProfits from './utilities/SkuProfits'
import Reports from './utilities/Reports'

const App = () => {


	const [ordersPath, setOrdersPath] = useState('/');
	const [skuProfitsPath, setSkuProfits] = useState('/');
	const [outputPath, setOutputPath] = useState('/');
	const [parsedOrders, setParsedOrders] = useState({});
	const [parsedSkuProfits, setParsedSkuProfits] = useState({});

	useEffect(() => {
		if (ordersPath && ordersPath !== '/') {
			const parsedOrders = new Orders(ordersPath[0])
			parsedOrders.parseOrders().then(() => setParsedOrders(parsedOrders))
		}
	}, [ordersPath])

	useEffect(() => {
		if (skuProfitsPath && skuProfitsPath !== '/') {
			const parsedSkuProfits = new SkuProfits(skuProfitsPath[0])
			parsedSkuProfits.parseSkuProfits().then(() => setParsedSkuProfits(parsedSkuProfits))
		}
	}, [skuProfitsPath])

	useEffect(() => {
		if ((parsedOrders.orders && parsedOrders.orders.size > 0) &&
		(parsedSkuProfits.profitMap && parsedSkuProfits.profitMap.size > 0)) {
			parsedOrders.applyProfits(parsedSkuProfits.profitMap)
		}
	}, [parsedOrders, parsedSkuProfits])

	const saveReports = (cb) => {
		let reports = new Reports(parsedOrders.orders, outputPath[0])
		reports.saveFiles().then(() => cb())
	}

	return (
		<div id="app">
			<Grid container>
				<Grid item xs={4}>
					<SelectLocalFile title='Select Orders File' 
						path={ordersPath} filterName='CSV File'
						filterExtensions={['csv']}
						pathCallback={setOrdersPath}
						errors={parsedOrders.errors}
						success={parsedOrders.success} />
				</Grid>
				<Grid item xs={4}>
					<SelectLocalFile title='Select SKU Profits File'
						path={skuProfitsPath}
						filterName='CSV File'
						filterExtensions={['csv']}
						pathCallback={setSkuProfits}
						errors={parsedSkuProfits.errors}
						success={parsedSkuProfits.success} />
				</Grid>
				<Grid item xs={4}>
					<SelectLocalFile 
						title='Output Reports Folder' 
						path={outputPath} 
						filterName='Choose Directory' 
						pathCallback={setOutputPath} />
				</Grid>
				<Grid item xs={12}>
					<ProcessFiles 
						outputPath={outputPath}
						ordersErrors={parsedOrders.errors}
						profitErrors={parsedSkuProfits.errors}
						onProcess={saveReports} />
				</Grid>
			</Grid>
		</div>
	)
}

	export default App
