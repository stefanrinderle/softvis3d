/* Temporary solution while refactoring is still in progress.
 * Once all the modules are in one project, this file should be used as app.
 */
module.exports = {
    'model': require('./model/index'),
    'viewer': require('./viewer/index')
};
