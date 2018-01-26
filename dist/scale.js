'use strict';

System.register(['lodash'], function (_export, _context) {
    "use strict";

    var _, _createClass, colorSchemes, Scale;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_lodash) {
            _ = _lodash.default;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            colorSchemes = [{ name: 'RdYlGn', value: 'interpolateRdYlGn', invert: 'always' }, { name: 'Blues', value: 'interpolateBlues', invert: 'dark' }, { name: 'Greens', value: 'interpolateGreens', invert: 'dark' }, { name: 'Greys', value: 'interpolateGreys', invert: 'dark' }, { name: 'Oranges', value: 'interpolateOranges', invert: 'dark' }, { name: 'Purples', value: 'interpolatePurples', invert: 'dark' }, { name: 'Reds', value: 'interpolateReds', invert: 'dark' }, { name: 'BuGn', value: 'interpolateBuGn', invert: 'dark' }, { name: 'BuPu', value: 'interpolateBuPu', invert: 'dark' }, { name: 'GnBu', value: 'interpolateGnBu', invert: 'dark' }, { name: 'OrRd', value: 'interpolateOrRd', invert: 'dark' }, { name: 'PuBuGn', value: 'interpolatePuBuGn', invert: 'dark' }, { name: 'PuBu', value: 'interpolatePuBu', invert: 'dark' }, { name: 'PuRd', value: 'interpolatePuRd', invert: 'dark' }, { name: 'RdPu', value: 'interpolateRdPu', invert: 'dark' }, { name: 'YlGnBu', value: 'interpolateYlGnBu', invert: 'dark' }, { name: 'YlGn', value: 'interpolateYlGn', invert: 'dark' }, { name: 'YlOrBr', value: 'interpolateYlOrBr', invert: 'dark' }, { name: 'YlOrRd', value: 'interpolateYlOrRd', invert: 'dark' }];

            _export('Scale', Scale = function () {
                function Scale($scope, colorScheme) {
                    _classCallCheck(this, Scale);

                    this.colorScheme = colorScheme;
                    this.hexArray = [];
                    this.rgbArray = [];
                }

                _createClass(Scale, [{
                    key: 'setColorScheme',
                    value: function setColorScheme(colorScheme) {
                        this.colorScheme = colorScheme;
                    }
                }, {
                    key: 'getColorSchemes',
                    value: function getColorSchemes() {
                        return colorSchemes;
                    }
                }, {
                    key: 'getColor',
                    value: function getColor(percentage) {
                        for (var i = 1; i < this.hexArray.length; i++) {
                            if (i * (100 / this.hexArray.length) >= percentage) {
                                //console.log("Line",this.hexArray[i-1]);
                                return this.hexArray[i];
                            }
                        }
                        return this.hexArray[this.hexArray.length - 1];
                    }
                }, {
                    key: 'componentToHex',
                    value: function componentToHex(c) {
                        var hex = c.toString(16);
                        var code = hex.length === 1 ? '0' + hex : hex;
                        return code.charAt(0) === '-' ? code.slice(1, code.length) : code;
                    }
                }, {
                    key: 'calculate',
                    value: function calculate(r, g, b, x, y, z) {
                        for (var i = 0; i < 50; i++) {
                            r = r + x;
                            g = g + y;
                            b = b + z;
                            var str = 'rgb(' + r + ',' + g + ',' + b + ')';
                            this.rgbArray.push(str);
                            this.hexArray.push("#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b));
                        }
                    }
                }, {
                    key: 'hexToRgb',
                    value: function hexToRgb(hex) {
                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                        return result ? {
                            r: parseInt(result[1], 16),
                            g: parseInt(result[2], 16),
                            b: parseInt(result[3], 16)
                        } : null;
                    }
                }, {
                    key: 'calculateOpacity',
                    value: function calculateOpacity(color) {

                        var r = this.hexToRgb(color).r;
                        var g = this.hexToRgb(color).g;
                        var b = this.hexToRgb(color).b;
                        console.log("hex to rgb", r, g, b);

                        var rgb = r + ',' + g + ',' + b;
                        console.log("hex to rgb", rgb);

                        var x = (255 - r) / 50;
                        var y = (255 - g) / 50;
                        var z = (255 - b) / 50;

                        var newR = r;
                        var newG = g;
                        var newB = b;
                        for (var i = 0; i < 50; i++) {
                            newR = newR + parseInt(x);
                            newG = newG + parseInt(y);
                            newB = newB + parseInt(z);
                            var str = 'rgb(' + newR + ',' + newG + ',' + newB + ')';
                            this.rgbArray.push(str);
                            this.hexArray.push("#" + this.componentToHex(newR) + this.componentToHex(newG) + this.componentToHex(newB));
                        }
                    }
                }, {
                    key: 'displayOpacity',
                    value: function displayOpacity(color) {
                        console.log("First letter", color.charAt(0));
                        this.rgbArray = [];
                        this.hexArray = [];
                        if (color.charAt(0) == '#') this.calculateOpacity(color);
                        //console.log("Color to opac",color);
                        //console.log("rgb arr",this.rgbArray);
                        else {
                                //var tempColor="#" + this.componentToHex(color.charAt(4)) + this.componentToHex(color.charAt(6)) + this.componentToHex(color.charAt(8));
                                //console.log("rgb",color.charAt(4),',',color.charAt(6),',',color.charAt(8));
                                var colorarr = color.substring(4, color.length - 1).replace(/ /g, '').split(',');
                                console.log(colorarr[0]);
                                var tempColor = "#" + this.componentToHex(parseInt(colorarr[0])) + this.componentToHex(parseInt(colorarr[1])) + this.componentToHex(parseInt(colorarr[2]));
                                this.calculateOpacity(tempColor);
                            }
                        //this.calculateOpacity(color);
                        return {
                            rgb_values: this.rgbArray,
                            hex_values: this.hexArray
                        };
                    }
                }, {
                    key: 'displayColor',
                    value: function displayColor(color) {
                        this.rgbArray = [];
                        this.hexArray = [];
                        var r = 0;
                        var g = 0;
                        var b = 0;

                        switch (color) {
                            case 'interpolateRdYlGn':
                                this.calculate(255, g, b, -3, 5, 0);
                                break;

                            case 'interpolateOranges':
                                this.calculate(255, 46, 0, 0, 3, 0);
                                break;

                            case 'interpolateGreens':
                                this.calculate(r, 255, b, 5, 0, 5);
                                break;

                            case 'interpolateBlues':
                                this.calculate(r, g, 255, 4, 4, 0);
                                break;

                            case 'interpolateReds':
                                this.calculate(250, g, b, 0, 5, 5);
                                break;

                            case 'interpolateYlOrBr':
                                this.calculate(245, 230, 10, -2, -3, 1);
                                break;

                            case 'interpolateGreys':
                                this.calculate(r, g, b, 5, 5, 5);
                                break;

                            case 'interpolatePurples':
                                this.calculate(100, g, 255, 3, 5, 0);
                                break;

                            case 'interpolateBuGn':
                                this.calculate(r, g, 255, 0, 5, -5);
                                break;

                            case 'interpolateBuPu':
                                this.calculate(r, g, 255, 2, 0, -3);
                                break;

                            case 'interpolateGnBu':
                                this.calculate(r, 255, b, 0, -5, 5);
                                break;

                            case 'interpolateOrRd':
                                this.calculate(205, 150, b, 1, -3, 0);
                                break;

                            case 'interpolatePuBuGn':
                                this.calculate(200, g, 255, -4, 5, -5);
                                break;

                            case 'interpolatePuBu':
                                this.calculate(200, g, 255, -4, 3, 0);
                                break;

                            case 'interpolatePuRd':
                                this.calculate(90, g, 255, 3, 0, -5);
                                break;

                            case 'interpolateRdPu':
                                this.calculate(255, g, b, -1, 0, 5);
                                break;

                            case 'interpolateYlGn':
                                this.calculate(245, 245, b, -4, 0, 0);
                                break;

                            case 'interpolateYlGnBu':
                                this.calculate(255, 255, b, -3, -2, 2);
                                break;

                            case 'interpolateYlOrRd':
                                this.calculate(255, 255, b, 0, -5, 0);
                                break;

                        }

                        return {
                            rgb_values: this.rgbArray,
                            hex_values: this.hexArray
                        };
                    }
                }]);

                return Scale;
            }());

            _export('Scale', Scale);
        }
    };
});
//# sourceMappingURL=scale.js.map
