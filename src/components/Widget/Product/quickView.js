import React from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import {Grid, Typography} from '@material-ui/core';

const styles = props => ({
    root: {
        padding: '0 10px 0 10px',
    },
    img: {
        width: '100%',
        maxHeight: '255px !important',
    },
    cf6_image: {
        width: '100%',
        maxHeight: '255px !important',
        transition: 'background-image 1s ease-in-out',
        backgroundImage: 'url(' + props + ')',
        '&:hover': {
            backgroundImage: 'url(' + props.src + ')',
        }
    },

    oldPrice: {},
    price: {
        fontWeight: '900',
    }

});


class ResponsiveDialog extends React.Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            open: false,
        }
    }

    styles = theme => ({
        content: {
            "padding": this.props.padding,
            "min-height": "100vh",
            "background-color": this.props.backgroundColor
        }
    });

    render() {
        const {classes, src, name, category, regPrice, promotePrice} = this.props;

        return (
            <Grid container className={classes.root} direction={'column'}>
                <img src={src} className={classes.cf6_image}/>
                <Typography variant={'h5'} color={'primary'}>{category}</Typography>
                <Typography variant={'h6'} color={'secondary'}>{name}</Typography>
                {
                    promotePrice ?
                        <Grid item container direction={'row'}>

                            <Typography component={'del'} variant={'subtitle1'}
                                        className={classes.oldPrice}>$ {regPrice}</Typography>
                            <Typography variant={'subtitle1'} className={classes.price}>${promotePrice}</Typography>
                        </Grid>
                        : <Typography variant={'subtitle1'} className={classes.price}>$ {regPrice}</Typography>

                }

            </Grid>
        );
    }

}


export default withStyles(styles)(ResponsiveDialog)