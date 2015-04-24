var Output = (function () {
    function Output(options, logger) {
        this.options = options;
    }
    Output.prototype.save = function (filename, content) {
    };
    Output.prototype.flush = function () {
    };
    return Output;
})();
exports.Output = Output;
