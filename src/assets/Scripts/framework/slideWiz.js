//Git: https://github.com/iamwizzdom/slideWiz

$.fn.slideWiz = function (e) {
    'use strict';
    const FORWARD = 0;
    const BACKWARD = 1;

    var is_numeric = function (variable) {
        return (!isNaN(variable));
    };

    var is_array = function (variable) {
        return (variable.constructor.toString().indexOf("Array") > -1);
    };

    var array_shuffle = function (array) {
        if (!is_array(array)) throw "array_shuffle expects an array";
        var size = array.length;
        for (var i = (size - 1); i >= 0; i--) {
            var j = Math.floor((Math.random() * size));
            var random = array[j];
            array[j] = array[i];
            array[i] = random;
        }
        return array;
    };


    var move = true, position = 0, object = e,
        __tm = null, _tm, init, flip = 0, pixel = 0, pixel_arr = [],
        col = (is_numeric(object.col) ? object.col : 30), row = (is_numeric(object.row) ? object.row : 6);

    /**
     *
     * @param index
     */
    var setPosition = function (index) {
        position = index;
    };

    /**
     *
     * @returns {number}
     */
    var getPosition = function () {
        return position;
    };

    /**
     *
     * @param status
     */
    var setMove = function (status) {
        move = status;
    };

    /**
     *
     * @returns {boolean}
     */
    var getMove = function () {
        return move;
    };

    /**
     *
     * @param position
     * @returns {void|*|jQuery}
     */
    var getMainImage = function (position) {
        return $('<img>').attr("src", object.file[position].src.main);
    };

    /**
     *
     * @param position
     * @returns {void|*|jQuery}
     */
    var getCoverImage = function (position) {
        return $('<div>').attr("class", object.type).append(
            $('<img>').attr("src", object.file[position].src.cover)
        );
    };

    /**
     *
     * @param position
     * @returns {*}
     */
    var getDetail = function (position) {
        var detail_box = $('<div>');
        if (object.file[position].title !== false) {
            detail_box.append(
                $('<h3>').attr("class", "detail-title").html(e.file[position].title)
            );
        }
        if (object.file[position].desc !== false) {
            detail_box.append(
                $('<span>').attr("class", "detail-desc").html(object.file[position].desc.substring(0,
                    object.file[position].desc.substring(0, 130).lastIndexOf(" ")) +
                    (object.file[position].desc.length > 130 ? "..." : ""))
            );
        }
        if (object.file[position].button !== false) {
            if (object.file[position].button.url !== false) {
                detail_box.append(
                    $('<a>').attr({'href': object.file[position].button.url, 'target': '_blanck'}).html(
                        $('<button>').attr({
                            class: "detail-button " + (object.file[position].button.class !== false ?
                                object.file[position].button.class : ""),
                            style: (object.file[position].button.color !== false ? "color: " +
                                object.file[position].button.color : "")
                        }).html(object.file[position].button.text)
                    )
                );
            } else {
                detail_box.append(
                    $('<button>').attr({
                        class: "detail-button " + (object.file[position].button.class !== false ?
                            object.file[position].button.class : ""),
                        style: (object.file[position].button.color !== false ? "color: " +
                            object.file[position].button.color : "")
                    }).html(object.file[position].button.text)
                );
            }
        }
        return detail_box.children();
    };

    /**
     *
     * @param direction
     * @returns {boolean}
     */
    var slide = function (direction) {
        if (getMove() !== true) {
            return false;
        }

        setMove(false);

        if (__tm !== null) {
            clearTimeout(__tm);
        }

        var holder = $('.slide-container .slide-holder'),
            slide_container = $('.slide-container'),
            detail_box = $('.slide-container .detail-box'),
            container_height = slide_container.innerHeight(),
            detail_height = 0, callback,
            height = holder.innerHeight(),
            tm, _tm, position, children = holder.children(), child_length = children.length,
            t_m = null, c = 0, x = 0, func_first, func_sec, func_third, func_fourth,
            max_width = holder.width(), max_height = holder.height(), min_width = (max_width / col),
            min_height = (max_height / row);

        switch (object.type) {
            case"card":

                if (direction === FORWARD) {
                    position = getPosition() === (object.file.length - 1) ? 0 : (getPosition() + 1);
                    holder.append(getCoverImage(position).css('bottom', '-' + height + 'px'));
                } else {
                    position = getPosition() === 0 ? (object.file.length - 1) : (getPosition() - 1);
                    holder.prepend(getCoverImage(position).css('bottom', height + 'px'));
                }

                children = holder.children();
                setPosition(position);

                $('.slide-container .detail-box').css('bottom', '-' + container_height + 'px');
                $('.slide-container .main-image-box').css('top', '-300px');

                if (direction === BACKWARD) {
                    $(children[1]).css({
                        "z-index": "5"
                    });
                }

                tm = setTimeout(function () {

                    $(children[(direction === FORWARD ? 1 : 0)]).css({
                        'bottom': "0",
                        "z-index": "10"
                    });

                    _tm = setTimeout(function () {

                        var position = getPosition();

                        detail_box.html(
                            getDetail(position)
                        );

                        detail_height = detail_box.innerHeight();

                        detail_box.css('bottom', ((container_height - detail_height) / 2));

                        if (object.file[position].src.main !== false) {
                            $('.slide-container .main-image-box').html(
                                getMainImage(position)
                            ).css('top', 50);
                        }

                        $(children[(direction === FORWARD ? 0 : 1)]).detach();
                        clearTimeout(tm);
                        clearTimeout(_tm);

                        setMove(true);
                        if (object.auto === true) {
                            __tm = setTimeout(init, object.speed);
                        }

                    }, 600);

                }, 200);

                break;

            case"fade":

                if (direction === FORWARD) {
                    position = getPosition() === (object.file.length - 1) ? 0 : (getPosition() + 1);
                    holder.append(getCoverImage(position).hide());
                } else {
                    position = getPosition() === 0 ? (object.file.length - 1) : (getPosition() - 1);
                    holder.prepend(getCoverImage(position).hide());
                }

                children = holder.children();
                setPosition(position);

                $('.slide-container .detail-box').css('bottom', '-' + container_height + 'px');
                $('.slide-container .main-image-box').css('top', '-300px');

                tm = setTimeout(function () {

                    $(children[(direction === FORWARD ? 0 : 1)]).fadeOut(800, function () {

                        var position = getPosition();

                        detail_box.html(
                            getDetail(position)
                        );

                        detail_height = detail_box.innerHeight();

                        detail_box.css('bottom', ((container_height - detail_height) / 2));

                        if (object.file[position].src.main !== false) {
                            $('.slide-container .main-image-box').html(
                                getMainImage(position)
                            ).css('top', 50);
                        }

                        $(children[(direction === FORWARD ? 1 : 0)]).fadeIn(800, function () {
                            $(children[(direction === FORWARD ? 0 : 1)]).detach();

                            setMove(true);
                            if (object.auto === true) {
                                __tm = setTimeout(init, object.speed);
                            }

                        });

                    });

                }, 200);

                break;

            case"box3D":

                if (direction === FORWARD) {
                    position = getPosition() === (object.file.length - 1) ? 0 : (getPosition() + 1);
                    holder.append(getCoverImage(position).hide());
                } else {
                    position = getPosition() === 0 ? (object.file.length - 1) : (getPosition() - 1);
                    holder.prepend(getCoverImage(position).hide());
                }

                children = holder.children();
                setPosition(position);

                $('.slide-container .detail-box').css('bottom', '-' + container_height + 'px');
                $('.slide-container .main-image-box').css('top', '-300px');

                tm = setTimeout(function () {

                    if (direction === FORWARD) {

                        $(children[1]).show().children('img').css('object-fit', 'cover');

                    } else {

                        $(children[1]).children('img').css('object-fit', '');

                    }

                    callback = function () {

                        var position = getPosition();

                        detail_box.html(
                            getDetail(position)
                        );

                        detail_height = detail_box.innerHeight();

                        detail_box.css('bottom', ((container_height - detail_height) / 2));

                        if (object.file[position].src.main !== false) {
                            $('.slide-container .main-image-box').html(
                                getMainImage(position)
                            ).css('top', 50);
                        }

                        if (direction === BACKWARD) {
                            $(this).children('img').css('object-fit', 'cover');
                        }

                        $(children[(direction === FORWARD ? 0 : 1)]).detach();

                        setMove(true);
                        if (object.auto === true) {
                            __tm = setTimeout(init, object.speed);
                        }

                    };

                    if (direction === FORWARD) {

                        $(children[0]).slideUp(1000, callback).children('img').css('object-fit', '');

                    } else {

                        $(children[0]).slideDown(1000, callback);

                    }

                }, 200);

                break;

            case"glide":

                if (direction === FORWARD) {
                    position = getPosition() === (object.file.length - 1) ? 0 : (getPosition() + 1);
                    holder.append(getCoverImage(position).css('right', '-' + max_width + 'px'));
                } else {
                    position = getPosition() === 0 ? (object.file.length - 1) : (getPosition() - 1);
                    holder.prepend(getCoverImage(position).css('right', max_width + 'px'));
                }

                children = holder.children();
                setPosition(position);

                $('.slide-container .detail-box').css('bottom', '-' + container_height + 'px');
                $('.slide-container .main-image-box').css('top', '-300px');

                if (direction === BACKWARD) {
                    $(children[1]).css({
                        "z-index": "5"
                    });
                }

                tm = setTimeout(function () {

                    $(children[(direction === FORWARD ? 1 : 0)]).css({
                        'right': "0",
                        "z-index": "10"
                    });

                    _tm = setTimeout(function () {

                        var position = getPosition();

                        detail_box.html(
                            getDetail(position)
                        );

                        detail_height = detail_box.innerHeight();

                        detail_box.css('bottom', ((container_height - detail_height) / 2));

                        if (object.file[position].src.main !== false) {
                            $('.slide-container .main-image-box').html(
                                getMainImage(position)
                            ).css('top', 50);
                        }

                        $(children[(direction === FORWARD ? 0 : 1)]).detach();
                        clearTimeout(tm);
                        clearTimeout(_tm);

                        setMove(true);
                        if (object.auto === true) {
                            __tm = setTimeout(init, object.speed);
                        }

                    }, 600);

                }, 200);

                break;

            case"slice":

                if (direction === FORWARD) {
                    position = getPosition() === (object.file.length - 1) ? 0 : (getPosition() + 1);
                } else {
                    position = getPosition() === 0 ? (object.file.length - 1) : (getPosition() - 1);
                    c = (col - 1);
                    x = (col - 1);
                }

                func_first = function () {
                    if (t_m !== null) {
                        clearTimeout(t_m);
                    }

                    if ((direction === BACKWARD ? c >= 0 : c <= child_length)) {
                        $(children[c]).css({
                            width: min_width + 'px',
                            top: (max_height + 10) + 'px'
                        }).children('img').css({
                            width: max_width + 'px',
                            'margin-left': '-' + (min_width * c) + 'px'
                        });
                        direction === BACKWARD ? c-- : c++;
                        t_m = setTimeout(func_first, 30);
                    } else {
                        func_sec();
                    }
                };

                func_first();

                $('.slide-container .detail-box').css('bottom', '-' + container_height + 'px');
                $('.slide-container .main-image-box').css('top', '-300px');

                func_sec = function () {

                    setPosition(position);

                    tm = setTimeout(function () {

                        var position = getPosition();

                        func_third = function () {
                            if (t_m !== null) {
                                clearTimeout(t_m);
                            }

                            if ((direction === BACKWARD ? x >= 0 : x <= child_length)) {

                                $(children[x]).css({width: min_width + 'px', top: 0}).children('img').css({
                                    width: max_width + 'px',
                                    'margin-left': '-' + (min_width * x) + 'px'
                                }).attr('src', object.file[position].src.cover);
                                direction === BACKWARD ? x-- : x++;
                                t_m = setTimeout(func_third, 30);

                            } else {
                                func_fourth();
                            }
                        };

                        func_third();

                        func_fourth = function () {

                            _tm = setTimeout(function () {

                                detail_box.html(
                                    getDetail(position)
                                );

                                detail_height = detail_box.innerHeight();

                                detail_box.css('bottom', ((container_height - detail_height) / 2));

                                if (object.file[position].src.main !== false) {
                                    $('.slide-container .main-image-box').html(
                                        getMainImage(position)
                                    ).css('top', 50);
                                }

                                clearTimeout(tm);
                                clearTimeout(_tm);
                                clearTimeout(t_m);
                                setMove(true);
                                if (object.auto === true) {
                                    __tm = setTimeout(init, object.speed);
                                }

                            }, 300);

                        };

                    }, 200);

                };

                break;

            case"flip":

                if (direction === FORWARD) {
                    position = getPosition() === (object.file.length - 1) ? 0 : (getPosition() + 1);
                } else {
                    position = getPosition() === 0 ? (object.file.length - 1) : (getPosition() - 1);
                    x = (col - 1);
                }

                $('.slide-container .detail-box').css('bottom', '-' + container_height + 'px');
                $('.slide-container .main-image-box').css('top', '-300px');

                func_sec = function () {

                    setPosition(position);

                    tm = setTimeout(function () {

                        var position = getPosition();

                        func_third = function () {
                            if (t_m !== null) {
                                clearTimeout(t_m);
                            }

                            if ((direction === BACKWARD ? x >= 0 : x <= child_length)) {

                                $(children[x]).addClass('flipper').children('img').css({
                                    width: max_width + 'px',
                                    'margin-left': '-' + (min_width * x) + 'px'
                                }).attr('src', object.file[position].src.cover);

                                direction === BACKWARD ? x-- : x++;
                                t_m = setTimeout(func_third, (direction === BACKWARD ?
                                    (x >= 1 ? 40 : 200) : (x <= (child_length - 1) ? 40 : 200)));

                            } else {
                                children.removeClass('flipper');
                                func_fourth();
                            }
                        };

                        func_third();

                        func_fourth = function () {

                            _tm = setTimeout(function () {

                                detail_box.html(
                                    getDetail(position)
                                );

                                detail_height = detail_box.innerHeight();

                                detail_box.css('bottom', ((container_height - detail_height) / 2));

                                if (object.file[position].src.main !== false) {
                                    $('.slide-container .main-image-box').html(
                                        getMainImage(position)
                                    ).css('top', 50);
                                }

                                clearTimeout(tm);
                                clearTimeout(_tm);
                                clearTimeout(t_m);
                                if (flip === 0) {
                                    flip = 1;
                                } else {
                                    flip = 0
                                }
                                setMove(true);
                                if (object.auto === true) {
                                    __tm = setTimeout(init, object.speed);
                                }

                            }, 300);

                        };

                    }, 300);

                };

                func_sec();

                break;

            case 'pixel':

                if (direction === FORWARD) {
                    position = getPosition() === (object.file.length - 1) ? 0 : (getPosition() + 1);
                } else {
                    position = getPosition() === 0 ? (object.file.length - 1) : (getPosition() - 1);
                }

                $('.slide-container .detail-box').css('bottom', '-' + container_height + 'px');
                $('.slide-container .main-image-box').css('top', '-300px');

                setPosition(position);

                tm = setTimeout(function () {

                    var position = getPosition();

                    pixel_arr = array_shuffle(pixel_arr);
                    child_length = pixel_arr.length;

                    var img_height = $(children[0]).children('img').innerHeight();

                    func_first = function () {

                        if (x < child_length) {

                            var index = pixel_arr[x], z = index['index'],
                                v = index['position'], b = index['batch'], x_width = 0,
                                x_margin_left = 0, x_margin_top = 0;

                            if (img_height < max_height) {
                                img_height = (img_height + (max_height - img_height));
                                x_width = (max_height - img_height);
                                x_margin_left = (x_width / 2);
                            } else if (img_height > max_height) {
                                x_margin_top = ((img_height - max_height) / 2);
                            }

                            $(children[z]).addClass((pixel === 0 ? 'pixel-scale' : 'pixel-rotate')).css({
                                'width': (min_width + 'px'),
                                'height': (min_height + 'px')
                            }).children('img').css({
                                'width': (max_width + x_width) + 'px',
                                'height': img_height + 'px',
                                'margin-left': '-' + ((min_width * v) + x_margin_left) + 'px',
                                'margin-top': '-' + (b > 0 ? ((min_height * b) + x_margin_top) : x_margin_top) + 'px'
                            }).attr('src', object.file[position].src.cover);

                            t_m = setTimeout(func_first, (x < (child_length - 1) ? 10 : 200));
                            x++;

                        } else {
                            children.removeClass((pixel === 0 ? 'pixel-scale' : 'pixel-rotate'));
                            func_sec();
                        }

                    };

                    func_first();

                    func_sec = function () {

                        _tm = setTimeout(function () {

                            detail_box.html(
                                getDetail(position)
                            );

                            detail_height = detail_box.innerHeight();

                            detail_box.css('bottom', ((container_height - detail_height) / 2));

                            if (object.file[position].src.main !== false) {
                                $('.slide-container .main-image-box').html(
                                    getMainImage(position)
                                ).css('top', 50);
                            }

                            clearTimeout(tm);
                            clearTimeout(_tm);
                            clearTimeout(t_m);

                            if (pixel === 0) {
                                pixel = 1;
                            } else {
                                pixel = 0
                            }

                            setMove(true);
                            if (object.auto === true) {
                                __tm = setTimeout(init, object.speed);
                            }

                        }, 300);

                    };

                }, 200);

                break;
        }
    };

    var slide_container = $('<div>').attr('class', 'slide-container'),
        slide_holder = $('<div>').attr("class", "slide-holder"),
        main_image_box = $('<div>').attr('class', 'main-image-box'),
        detail_box = $('<div>').attr('class', 'detail-box'), i = 0;

    if (object.type === 'slice' || object.type === 'flip') {

        for (; i < col; i++) {
            slide_holder.append(getCoverImage(0));
        }

    } else if (object.type === 'pixel') {

        var r = (col * row);
        for (; i < r; i++) {
            slide_holder.append(getCoverImage(0));
        }

    } else {

        slide_holder.append(getCoverImage(0).css({
            'z-index': 10,
            'bottom': '0'
        }).children('img').css('object-fit', 'cover').parent());

    }

    main_image_box.append(getMainImage(0));

    detail_box.append(getDetail(0));

    $(this).append(slide_container.append(slide_holder)
        .append(main_image_box).append(detail_box).append(
            $('<button>').attr({
                class: "half-circle-prev",
                title: "Previous"
            }).html(
                $('<span>').html("&#10094;")
            ).click(function () {
                if (getMove() === true) {

                    slide(BACKWARD);

                }
            })
        ).append(
            $('<button>').attr({
                class: "half-circle-next",
                title: "Next"
            }).html(
                $('<span>').html("&#10095;")
            ).click(function () {
                if (getMove() === true) {

                    slide(FORWARD);

                }
            })
        ));

    var delay = setTimeout(function () {

        var max_width = $('.slide-holder').width(), max_height = $('.slide-holder').height(),
            min_width = (max_width / col), min_height = (max_height / row),
            children = $('.slide-holder').children('div'), child_length = children.length,
            img_height = $(children[0]).children('img').innerHeight(), i = 0, x = col, v = 0, b = 0,

            func_init = function () {

                var detail_box = $('.slide-container .detail-box'),
                    slide_container = $('.slide-container'),
                    container_height = slide_container.innerHeight(),
                    detail_height = detail_box.innerHeight();
                detail_box.css('bottom', ((container_height - detail_height) / 2));
                main_image_box.css('top', 50);

                if (object.auto === true) {

                    init = function () {

                        if (getMove() === true) {
                            slide(FORWARD);
                        }

                    };

                    _tm = setTimeout(function () {
                        init();
                        clearTimeout(_tm);
                    }, object.speed);
                }

                clearTimeout(delay);
            };

        if (object.type === 'slice') {

            for (; i < child_length; i++) {

                $(children[i]).css({width: min_width + 'px', top: 0}).children('img').css({
                    width: max_width + 'px',
                    'margin-left': '-' + (min_width * i) + 'px'
                });

                if (i >= (child_length - 1)) {
                    func_init();
                }

            }

        } else if (object.type === 'flip') {

            for (; i < child_length; i++) {

                $(children[i]).css('width', (min_width + 'px')).children('img').css({
                    width: max_width + 'px',
                    'margin-left': '-' + (min_width * i) + 'px'
                });

                if (i >= (child_length - 1)) {
                    func_init();
                }

            }

        } else if (object.type === 'pixel') {

            for (; i < child_length; i++) {

                if (i >= x) {
                    x = x + col;
                    v = 0;
                    b++;
                }

                var map = [], x_width = 0, x_margin_left = 0, x_margin_top = 0;

                map['index'] = i;
                map['position'] = v;
                map['batch'] = b;

                if (img_height < max_height) {
                    img_height = (img_height + (max_height - img_height));
                    x_width = (max_height - img_height);
                    x_margin_left = (x_width / 2);
                } else if (img_height > max_height) {
                    x_margin_top = ((img_height - max_height) / 2);
                }

                $(children[i]).css({
                    'width': (min_width + 'px'),
                    'height': (min_height + 'px')
                }).children('img').css({
                    'width': (max_width + x_width) + 'px',
                    'height': img_height + 'px',
                    'margin-left': '-' + ((min_width * v++) + x_margin_left) + 'px',
                    'margin-top': '-' + (b > 0 ? ((min_height * b) + x_margin_top) : x_margin_top) + 'px'
                });

                pixel_arr.push(map);

                if (i >= (child_length - 1)) {
                    func_init();
                }

            }

        } else {
            func_init();
        }

    }, 300);
};