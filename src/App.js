import React, { Component } from 'react';
import Typography from 'preact-material-components/Typography';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import SelectLocalFile from './SelectLocalFile';

export default class App extends Component {
	render() {
		return (
			<div id="app">
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="4">
							<SelectLocalFile title='Select Orders File' path='/' filterName='CSV File' filterExtensions={['csv']} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="4">
							<SelectLocalFile title='Select SKU Profits File' path='/' filterName='CSV File' filterExtensions={['csv']} />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="4">
							<SelectLocalFile title='Output Reports Folder' path='/' filterName='Choose Directory' />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12">
							<div style={{ textAlign: 'center' }}>
								<Typography headline6>
									Run Report
								</Typography>
							</div>
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
				</LayoutGrid>
			</div>
		);
	}
}
