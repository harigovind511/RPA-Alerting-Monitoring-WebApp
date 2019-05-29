//animation list: card, fade, box3D, glide

$(document).ready(function () {
    $('.slideWiz').slideWiz(
        {
            auto: true,
            speed: 5000,
            type : 'pixel',
            row: 9,
            file : [
                {
                    src: {
                        main: "https://picsum.photos/1920/1200?image=1081",
                        cover: "https://picsum.photos/1920/1200?image=1081"
                    },
                    title: 'slideWiz Library',
                    desc: 'slideWiz is a JQuery based library created by a Nigerian by the name\n' +
                    '                    \'Wisdom Emenike\' who currently works at Imaxinacion Tech, one of Nigeria\'s leading IT companies.',
                    button: {
                        text: 'Download',
                        url: 'https://github.com/iamwizzdom/slideWiz',
                        class: 'btn btn-medium btn-primary',
                        color: '#3781ce'
                    }
                },
                {
                    src: {
                        main: "https://picsum.photos/1920/1200?image=760",
                        cover: "https://picsum.photos/1920/1200?image=760"
                    },
                    title: 'slideWiz Library',
                    desc: 'slideWiz is a JQuery based library created by a Nigerian by the name\n' +
                    '                    \'Wisdom Emenike\' who currently works at Imaxinacion Tech, one of Nigeria\'s leading IT companies.',
                    button: {
                        text: 'Goal.com',
                        url: 'https://github.com/iamwizzdom/slideWiz',
                        class: 'btn btn-medium btn-primary',
                        color: '#3781ce'
                    }
                },
                {
                    src: {
                        main: "https://picsum.photos/1920/1200?image=755",
                        cover: "https://picsum.photos/1920/1200?image=755"
                    },
                    title: 'slideWiz Library',
                    desc: 'slideWiz is a JQuery based library created by a Nigerian by the name\n' +
                    '                    \'Wisdom Emenike\' who currently works at Imaxinacion Tech, one of Nigeria\'s leading IT companies.',
                    button: {
                        text: 'SuperSports',
                        url: 'https://github.com/iamwizzdom/slideWiz',
                        class: 'btn btn-medium btn-primary',
                        color: '#3781ce'
                    }
                },
                {
                    src: {
                        main: "https://picsum.photos/1920/1200?image=726",
                        cover: "https://picsum.photos/1920/1200?image=726"
                    },
                    title: 'slideWiz Library',
                    desc: 'slideWiz is a JQuery based library created by a Nigerian by the name\n' +
                    '                    \'Wisdom Emenike\' who currently works at Imaxinacion Tech, one of Nigeria\'s leading IT companies.',
                    button: {
                        text: 'NBA.com',
                        url: false,
                        class: 'btn btn-medium btn-primary',
                        color: '#3781ce'
                    }
                }
            ]

        }
    );
});
