import React, {useEffect, useRef} from 'react';
import {Grid, Typography} from '@material-ui/core';
import List from '../Widget/List'
import Header from '../Layout/Body/Header'
import classNames from 'classnames';
import {connect} from 'react-redux'
import {EDIT_PRODUCT_VIEW_MODE, PRODUCT_EDIT_FILTER, PRODUCT_EDIT_SORT} from "../../constants/actionType";
import {withStyles} from '@material-ui/core/styles';
import WhiteDropDown from '../Widget/DropDown'
import LoadingPage from '../Layout/LoadingPage'
import _ from 'lodash'
import ProductOverviewListForm from '../Widget/Product/overviewList'
import {
    arrayToFilter,
    getTagsCountsArray,
    handleImgValid,
    numberToPagination,
    refactorTextLength,

} from "../../api/ApiUtils";
import ProductOverviewBox from '../Widget/Product/overviewBox'
import withWidth, {isWidthUp} from "@material-ui/core/withWidth/index";
import PopUp from '../Widget/PopUp'
import {keyOfI18n} from "../../constants/locale/interface";
import {I18nText} from "../Widget/I18nText";

const filterOptions = [<I18nText keyOfI18n={keyOfI18n.SHOP_SORT_NAME_ASC}/>,
    <I18nText keyOfI18n={keyOfI18n.SHOP_SORT_NAME_DES}/>, <I18nText keyOfI18n={keyOfI18n.SHOP_SORT_PRICE_ASC}/>,
    <I18nText keyOfI18n={keyOfI18n.SHOP_SORT_PRICE_DES}/>];
const styles = theme => ({
    productCategory: {
        backgroundColor: '#F7F7F7',
    },
    toolBar: {
        padding: '10px',
        backgroundColor: theme.palette.background.paper,
    },
    icon: {
        padding: '10px',
        cursor: 'pointer',
        alignItems: 'center',
        border: '1px solid black',

    }, listMode: {
        padding: '20px',
    },
    array: {
        paddingLeft: '5px',
    }
});

const mapStateToProps = state => ({
    products: state.product.products,
    viewMode: state.product.viewMode,
    sort: state.product.sort,
    filter: state.product.filter,
});

const mapDispatchToProps = dispatch => ({

    changeViewMode: (mode) =>
        dispatch({
                type: EDIT_PRODUCT_VIEW_MODE,
                payload: mode,
            }
        )
    ,
    editProductSort: (key, value) => dispatch({
        type: PRODUCT_EDIT_SORT,
        payload: {
            key: key,
            value: value,
        },
    }),
    editProductFilter: (key, value) => dispatch({
        type: PRODUCT_EDIT_FILTER,
        payload: {
            key: key,
            value: value,
        },
    }),
});

const ShopOverview = props => {
    let initFilter = () => {
        let query = props.history.location.search;
        let isTags = (query.slice(_.lastIndexOf(query, '?'), _.lastIndexOf(query, '=') + 1).indexOf('tags') !== -1);
        let queryTag = query.slice(_.lastIndexOf(query, '=') + 1, query.length);
        if (isTags && props.filter.tag !== queryTag) props.editProductFilter('tag', queryTag)

    };

    let sortData = () => {

        let data = Array.from(props.products);
        data = data.filter(n => (props.filter.tag) ? !!n.tags.find(k => k === props.filter.tag) : true);
        let sortBy = () => {
            const sort = filterOptions.NAME_ASC
            switch (sort) {
                case filterOptions.NAME_ASC:
                    return data.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
                case filterOptions.NAME_DES:
                    return data.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0) * -1);
                case filterOptions.PRICE_ASC:
                    return data.sort((a, b) => {
                            let priceA = a.variants[0] ? a.variants[0].price : 0;
                            let priceB = b.variants[0] ? b.variants[0].price : 0;
                            return (priceA < priceB) ? -1 : 1
                        }
                    );
                case filterOptions.PRICE_DES:
                    return data.sort((a, b) => {
                            let priceA = a.variants[0] ? a.variants[0].price : 0;
                            let priceB = b.variants[0] ? b.variants[0].price : 0;
                            return (priceA > priceB) ? -1 : 1
                        }
                    );
                default:
                    return data
            }
        };
        return sortBy()

    };
    let getProductProperty = (products, type) => {
        switch (type) {
            case 'display':
                if (props.sort.page) {
                    let range = props.sort.page.split(' - ');
                    return products.filter((n, i) => (i >= range[0] - 1 && i <= range[1] - 1))

                }
                return products;
            case 'length':
                return products.length

        }
    };
    let initPageNumber = length => props.editProductSort('page', numberToPagination(length, null)[0].label);
    let getTagsList = () => <List
        data={getTagsCountsArray(props.products, (tag, number) => {
            props.editProductFilter('tag', tag);
            initPageNumber(number)
        })}
        selectedValue={props.filter.tag}
    />;

    let getPagination = (products) => {
        if (products.length === 0) return null;
        let options = numberToPagination(getProductProperty(products, 'length'),
            page => props.editProductSort('page', page));
        //todo('have error of Warning: Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.")

        if (props.sort.page === '' && (!(_.isEmpty(options[0].label))))

            props.editProductSort('page', options[0].label);
        return (<WhiteDropDown
            options={options}
            selectedValue={props.sort.page}
        />)
    };
    let getProductsList = (products) => {


        if (products.length === 0) {
            return <Typography variant={'subtitle1'}> <I18nText keyOfI18n={keyOfI18n.THERE_ARE_NO_PRODUCTS_UNDER}/>
                <strong>{
                    props.filter.tag
                }</strong> <I18nText keyOfI18n={keyOfI18n.CATEGORY_YET}/></Typography>


        }


        return props.viewMode === 'form' ?

            getProductProperty(products, 'display').map((n, i) =>
                <Grid item xs={12} sm={6} md={4} key={i}
                >
                    <ProductOverviewBox
                        name={refactorTextLength(n.name)}
                        id={n.id}
                        src={handleImgValid(n.photos[0])}
                        category={n.tags}
                        regPrice={n.variants[0] ? n.variants[0].price : 'not a reg price'}
                        promotePrice={n.promotePrice}
                    />
                </Grid>
            ) : getProductProperty(products, 'display').map((n, i) => (<ProductOverviewListForm
                key={i}
                src={handleImgValid(n.photos[0])}
                name={refactorTextLength(n.name)}
                category={n.tags}
                regPrice={n.variants[0] ? n.variants[0].price : <I18nText keyOfI18n={keyOfI18n.NOT_A_REG_PRICE}/>}
                promotePrice={n.promotePrice}
                description={n.description}
                id={n.id}
            />))
    };

    let popUp = useRef();
    useEffect(() => initFilter());
    const {classes} = props;
    if (props.products === null) return <LoadingPage/>;
    const products = sortData();

    return (
        <Grid container justify={'center'}>
            <Grid item xs={12}>
                <Header
                    title={<I18nText keyOfI18n={keyOfI18n.SHOP}/>}
                    route={'home/shop'}
                />
            </Grid>

            {
                props.products.length > 0 ?
                    <Grid item lg={10} spacing={isWidthUp('md', props.width) ? 16 : 0} container>
                        {
                            isWidthUp('md', props.width) ?
                                <Grid item md={3}>
                                    <Typography variant={'h6'}>
                                        <I18nText keyOfI18n={keyOfI18n.PRODUCT_CATEGORY}/>
                                    </Typography>
                                    {getTagsList()}
                                </Grid> : null
                        }
                        <Grid item xs={12} md={9}>
                            <Grid item container xs={12} alignItems={'center'} justify={'space-between'}
                                  direction={'row'}
                                  className={classes.toolBar}>
                                <Grid item xs={6} md={2}>
                                <span
                                    onClick={() => props.changeViewMode('form')}
                                    className={classNames(classes.icon, 'icon-table')}/>
                                    <span
                                        onClick={() => props.changeViewMode('list')}
                                        className={classNames('icon-list', classes.icon)}/>
                                </Grid>
                                <Grid item xs={6} md={3} container alignItems={'center'} direction={'row'}>
                                    <Grid item>
                                        <Typography variant={'body1'}>
                                            <I18nText keyOfI18n={keyOfI18n.ITEMS}/>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        {
                                            getPagination(products)
                                        }
                                    </Grid>
                                    <Grid item>
                                        <Typography variant={'body1'}>
                                            {<I18nText
                                                keyOfI18n={keyOfI18n.OF}/>} {getProductProperty(products, 'length')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6} md={3} container alignItems={'center'} direction={'row'}>

                                    <Grid item>
                                        <Typography variant={'body1'}>
                                            <I18nText keyOfI18n={keyOfI18n.SORT_BY}/>
                                        </Typography>
                                    </Grid>
                                    <Grid item>

                                        <WhiteDropDown
                                            options={
                                                arrayToFilter(
                                                    filterOptions, value => {
                                                        props.editProductSort('sortBy', value);
                                                        initPageNumber(getProductProperty(sortData(), 'length'))
                                                    }
                                                )}
                                            selectedValue={props.sort.sortBy}
                                        />
                                    </Grid>
                                </Grid>
                                {
                                    isWidthUp('md', props.width) ? null : <Grid xs={6} item>
                                        <PopUp
                                            innerRef={e => popUp = e}
                                            title={
                                                <Grid container alignItems={'center'}>
                                                    <Typography variant={'body1'}>
                                                        {props.filter.tag ? <Typography
                                                                variant={'body1'}>{'tags:' + props.filter.tag}</Typography> :
                                                            <I18nText keyOfI18n={keyOfI18n.PRODUCT_CATEGORY}/>}
                                                    </Typography>
                                                    <span className={classes.array + ' ' + 'icon-circle-down'}/>
                                                </Grid>

                                            }
                                            popUp={getTagsList()}
                                        />

                                    </Grid>
                                }
                            </Grid>

                            <Grid item container className={classes.listMode}>
                                {
                                    getProductsList(products)
                                }
                            </Grid>
                        </Grid>
                    </Grid> :

                    <Typography variant={'subtitle1'}><I18nText
                        keyOfI18n={keyOfI18n.THERE_ARE_NO_PRODUCTS_UNDER}/></Typography>


            }
        </Grid>
    );
};

export default withWidth()(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShopOverview)))