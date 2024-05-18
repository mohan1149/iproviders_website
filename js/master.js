$(document).ready(function () {

    let isUseLogged = localStorage.getItem('_logged');
    if (isUseLogged === "yes") {
        $('#invoicesLink').removeClass('hidden');
        $('#loginButton').addClass('hidden');
        $('#logoutButton').removeClass('hidden');
        loadRepayments();
    }
    $('#logoutButton').on('click', () => {
        localStorage.removeItem('_logged');
        localStorage.removeItem('_user');
        window.location.reload();
    });

    $('#loginFormButton').on('click', () => {
        $('#loginModal').hide();
        let civil_id = $('#civil').val();
        let mobile = $('#mobile').val();
        try {
            $.ajax({
                url: 'https://shop.ebaaq8.com/api/customer-login/' + civil_id + '/' + mobile,
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    localStorage.setItem('_user', JSON.stringify(response));
                    localStorage.setItem('_logged', 'yes');
                    window.location.reload();
                },
                error: function (xhr, status, error) {
                    window.location.reload();
                }
            });
        } catch (error) {
            window.location.reload();
        }
    });

    function loadRepayments() {
        let cid = JSON.parse(localStorage.getItem('_user')).id;
        try {
            $.ajax({
                url: 'https://shop.ebaaq8.com/api/customer-repayments/' + cid,
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    response.map((item, index) => {
                        let row = "<tr>";
                        // row += "<td>" + (index+1) + "</td>";
                        row += "<td>" + item.actual_amount + "</td>";
                        row += "<td>" + item.fine_amount + "</td>";
                        row += "<td>" + item.amount + "</td>";
                        row += "<td>" + new Date(item.pay_date).toDateString() + "</td>";
                        row += "<td><button id='payInvBtn' onclick='payInstallments(" + JSON.stringify(item) + ")' class='btn btn-primary' data-toggle='modal' aria-pressed='false' data-target='#activityModal'>Pay Now</button></td>";
                        row += "</tr>";
                        $('#invoicesTable').append(row);
                    })
                },
                error: function (xhr, status, error) {

                }
            });
        } catch (error) {
            window.location.reload();
        }
    }
});
function payInstallments(data) {
    $('#activityModal').show();
    $.ajax({
        url: 'https://shop.ebaaq8.com/api/customer-get-payment-link/' + data.amount + '/' + data.order_instalment_id,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            window.location.assign(response.transaction.url);
        },
        error: function (xhr, status, error) {

        }
    });

}