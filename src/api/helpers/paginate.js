'use strict';
require('dotenv').config();

/**
 * Pagination 
 * @param {Number} page 
 * @param {Number} size 
 * @returns {Object}
 */
const getPagination = (page, size) => {
    const limit = size ? size : Number(process.env.PER_PAGE);
    const offset = page ? (page-1) * limit : 0;
    return { limit, offset };
};

/**
 * Getting Pagination Data
 * @param {String} datas 
 * @param {Number} page 
 * @param {Number} limit 
 * @returns {Object}
 */
const getPagingData = (datas, page, limit) => {
    // console.log(JSON.stringify(datas));
    const { count: totalItems, rows: data } = datas;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, data, totalPages, currentPage };
};

module.exports = { getPagination, getPagingData};