import React from 'react';
import {ContentWrapper} from 'components';
import {ComponentInfo} from 'model';
import {useLocation} from 'react-router-dom';
import styles from './index.module.scss';


export const CatalogProductPage = () => {
    const location:any = useLocation();

    //either pass data through navigate or through params and take data from redux
        
    console.log('PRODUCT PAGE - location', location);
    console.log('PRODUCT PAGE - location.state', location?.state?.componentInfo);

    const ProductContent = () => {
        return(
            <section><h1>PRODUCT CONTENT</h1></section>
        )
    }

    const ProductHeader = () => {
        return(
            <h1> Instagram </h1>
        )
    }

    return(
        <ContentWrapper header={<ProductHeader />} transparent leftOffset content={<ProductContent />} variantHeight="large"/>
    )

}