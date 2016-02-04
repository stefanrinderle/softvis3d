function requireAll(r) {
    r.keys().forEach(r);
}

module.exports = function () {
    /* Styles */
    require('../index.css');
    /* JS */
    require('jquery');
    require('angular');
    require('angular-route');
    require('three');
};