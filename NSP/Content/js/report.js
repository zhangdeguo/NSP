function convert(series) {
    for (var i = 0; i < series.length; i++) {
        var data = series[i].data;
        for (var j = 0; j < data.length; j++) {
            if (data[j] == null)
                data[j] = undefined;
        }
    }
}