$(document).ready(function () {
    $('.delete-news').on('click', function (e) {
        $target = $(e.target)
        const id = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '/news/' + id,
            success: function (response) {
                alert('Deleting News')
                window,location.href = '/'
            },
            error: function (err) {
                console.log(err);
            }
        })
    })
})
$(document).ready(() => {
    $('.delete-trophys').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/trophys/' + id,
            success: function (response) {
                alert('Deleting Trophys')
                window,location.href = '/'
            },
            error: (err) => {
                console.log(err);
            }
        })
    })
})