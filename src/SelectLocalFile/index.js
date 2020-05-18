import React, { Component } from 'react';
import Typography from 'preact-material-components/Typography';
import Button from 'preact-material-components/Button';
import TextField from 'preact-material-components/TextField';
import { dialog } from 'electron'

import style from './styles.css'

export default class SelectLocalFile extends Component {

    componentDidMount() {
        this.setState({path: this.props.path})
    }

    async onSelectFilePath() {
        const file = dialog.showOpenDialog({
            filters: [{ name: this.props.filterName, extensions: this.props.filterExtensions }],
            properties: !!this.props.filterExtensions ? ['openFile'] : ['openDirectory']
        })
    }

    render() {
        return (
            <div>
                <Button onClick={() => this.onSelectFilePath} class={style.button} raised>
                    {this.props.title}
                </Button>
                <TextField class={style.fileSelected} disabled outlined fill>
                    {this.props.path}
                </TextField>
            </div>
        );
    }
}
