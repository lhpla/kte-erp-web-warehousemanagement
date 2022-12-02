import {
    get,
    post
} from "./request";

/**
 *  查询举证内容
 * */
export const getProofContentFn = (params)=> {
    return get('/kte-warehouse/proofContent/getProofContent', params,false,false);
}

/**
 *  修改举证内容
 * */
export const saveOrUpdateProofContentFn = (params)=> {
    return post('/kte-warehouse/proofContent/saveOrUpdateProofContent', params,true ,false);
}

/**
 *  查看放大镜
 * */
export const selectDeliveryInformationByOrderCodeFn = (params)=> {
    return post('/kte-purchase/purchase/selectDeliveryInformationByOrderCode', params,true ,false);
}
