(function() {
    let f = this ? class g { } : class h { };
    console.log([
        typeof f,
        typeof h,
    ]);
})();