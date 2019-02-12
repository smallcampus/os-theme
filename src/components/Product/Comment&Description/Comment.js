import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import classNames from 'classnames'
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    root: {
        padding: '5px',
    },
    username: {},
    star: {
        '&:before': {
            color: 'gold',
        }
    }
}));

class WhiteDropDown extends React.Component {


    render() {
        const classes = useStyles();
        const {
            icon, value,
            icon2, label,
            labelExtra, options,
            selectedValue
        } = this.props;


        return (
            <Grid container className={classes.root} alignItems={'center'}>
                <Typography variant={'h6'} className={classes.username}>
                    Cristopher Lee
                </Typography>
                <span className={classNames('icon-star-full', classes.star)}/>
                <span className={classNames('icon-star-full', classes.star)}/>
                <span className={classNames('icon-star-full', classes.star)}/>
                <span className={classNames('icon-star-full', classes.star)}/>
                <span className={classNames('icon-star-full', classes.star)}/>
                <Typography variant={'body1'}>
                    (5)
                </Typography>
                <Typography variant={'body1'}>
                    enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia res eos qui ratione
                    voluptatem sequi Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                    adipisci veli
                </Typography>
            </Grid>
        )
    }
}

export default (WhiteDropDown);