import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
const { dialog } = require('electron').remote

const useStyles = makeStyles((themes) => ({
    root: {
      minWidth: 275,
      margin: themes.spacing(2)
    },
    title: {
      fontSize: 14,
    },
    error: {
        color: "red"
    },
    success: {
        color: "green"
    }
}));

const SelectLocalFile = ({filterExtensions, filterName, title, path, pathCallback, errors, success}) => {
    const classes = useStyles();
    const onSelectFilePath = async () => {
        const file = await dialog.showOpenDialog({
            filters: [{ name: filterName, extensions: filterExtensions }],
            properties: !!filterExtensions ? ['openFile'] : ['openDirectory']
        })
        pathCallback(file)
    }

    return (
        <Card className={classes.root}>
            <CardActions>
                <Button onClick={onSelectFilePath} variant="contained" size="small">
                    {title}
                </Button>
            </CardActions>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Path:
                </Typography>
                <Typography variant="body2" component="p">
                    {path}
                </Typography>
                {errors && errors.length > 0 && errors.map((error, index) =>
                    <Typography key={`error${title}${index}`} className={classes.error} variant="body2" component="p"> - {error}</Typography>
                )}

                {success && success.length > 0 && success.map((suc, index) =>
                    <Typography key={`error${title}${index}`} className={classes.success} variant="body2" component="p"> - {suc}</Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default SelectLocalFile
