import React from 'react';
import Select from 'react-select';
import {useTheme} from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import {emphasize} from '@material-ui/core/styles/colorManipulator';

import {COUNTRY_CODE} from '../../../constants/constants'
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
    root: {},
    input: {
        display: 'flex',
        padding: 0,

    },
    valueContainer: {
        display: 'flex',

        flexWrap: 'wrap',
        flex: 1,
        padding: '14.5px 0',
        paddingLeft: '5px',
        alignItems: 'center',
        overflow: 'hidden',
    },
    chip: {

        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontWeight: '600',

    },
    placeholder: {
        position: 'absolute',
    },
    paper: {
        zIndex: 1501,
        position: 'absolute',
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});


const selectStyles = theme => ({
    input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
            font: 'inherit',
        },
    }),
});

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({inputRef, ...props}) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            variant={"outlined"}
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}


function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};

const IntegrationReactSelect = props => {
    const {classes, value, onChange} = props;

    const theme = useTheme();


    return (
        <Select
            classes={classes}
            styles={selectStyles}
            options={COUNTRY_CODE}
            components={components}
            value={value}
            onChange={onChange}
            placeholder="Search"
        />

    );
};

export default withStyles(styles)(IntegrationReactSelect)