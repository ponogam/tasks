const dates_list = document.getElementById('dates-list');
const time_list = document.getElementById('time-list');
const seats_list = document.getElementById('seats-list');
const reservation = document.getElementById('reservation');

const getStringData = (date) => {
    const curr_date = date.getDate();
    const curr_month = date.getMonth() + 1;
    const curr_year = date.getFullYear();

    return curr_date + ' ' + curr_month + ' ' + curr_year;
}

const getTimeNow = () => {
    const today = new Date();
    const curr_hour = today.getHours();
    const curr_minutes = today.getMinutes();

    return curr_hour + ':' + curr_minutes;
}

const getDatesArray = () => {
    const dateOld = new Date();
    const dateNow = new Date();
    const arrDates = [];
    const arrNew = [];

    for (let i = 0; i <= 6; i++) {
        if (i !== 0) dateNow.setDate(dateNow.getDate() + 1);

        dateOld.setDate(dateOld.getDate() - 1);
        arrDates.push(getStringData(dateOld));
        arrNew.push(getStringData(dateNow));
    }

    return arrDates.reverse().concat(arrNew);
}

const renderDates = (arr) => {
    for (let i = 0; i < 14; i++) {
        const option = document.createElement('option');

        if (i === 7) option.setAttribute('selected', 'selected');

        option.innerHTML = arr[i];
        dates_list.append(option);
    }

    renderTime(timeArr);
}
const renderTime = (arr) => {
    time_list.innerHTML = '';

    let selected_time;

    for (let i = 0; i < arr.length; i++) {
        const span = document.createElement('span');

        if (i === 0) {
            span.className = 'choice';
            selected_time = arr[i].time;
        }
        span.innerHTML = arr[i].time
        time_list.append(span);
    }

    renderSeats(seatsArr, selected_time);
}
const renderSeats = (arr, time) => {
    seats_list.innerHTML = '';

    const date = dates_list.value;
    const tickets = searchTickets(date, time);
    const renderArray = tickets.findTickets ? tickets.findTickets.places : arr;

    for (let i = 0; i < renderArray.length; i++) {
        const span = document.createElement('span');

        span.className = 'seat';
        span.setAttribute('data-id', renderArray[i].id);
        span.setAttribute('data-occupied', renderArray[i].occupied);
        seats_list.append(span);

        if (i === renderArray.length / 2 - 1) seats_list.append(document.createElement('br'));
    }
    const curr_time = getTimeNow();
    // const curr_time = '17:46';

    if ((dates_list.selectedIndex === 7 && (Number(curr_time.slice(0, -3)) > Number(time.slice(0, -3)))) || dates_list.selectedIndex < 7) {
        seats_list.classList.add('hidden');
        reservation.disabled = true;
    } else {
        seats_list.classList.remove('hidden');
        reservation.disabled = false;
    }
}

const searchTickets = (date, time) => {
    const storageArray = JSON.parse(localStorage.getItem("tickets"));

    if (storageArray === null) return false

    const returnArray = storageArray.find((item => {
        if (item.time === time && item.date === date)
            return item;
        else
            return false;
    }));

    return {
        findTickets: returnArray,
        allTickets: storageArray
    };
}

const datesArr = getDatesArray();
const timeArr = [{ time: '10:00' }, { time: '12:00' }, { time: '14:00' }, { time: '16:00' }, { time: '18:00' }, { time: '20:00' }];
const seatsArr = [{ id: 1, occupied: false }, { id: 2, occupied: false }, { id: 3, occupied: false }, { id: 4, occupied: false }, { id: 5, occupied: false },
                  { id: 6, occupied: false }, { id: 7, occupied: false }, { id: 8, occupied: false }, { id: 9, occupied: false }, { id: 10, occupied: false },
                  { id: 11, occupied: false },{ id: 12, occupied: false },{ id: 13, occupied: false },{ id: 14, occupied: false },{ id: 15, occupied: false },{ id: 16, occupied: false }];


document.addEventListener('DOMContentLoaded', function() {
    renderDates(datesArr);

    dates_list.addEventListener('change', () => {
        renderTime(timeArr);
    });

    time_list.addEventListener('click', (e) => {
        let el = e.target;
        const choice = time_list.querySelectorAll('.choice');

        if (choice.length === 1) choice[0].classList.remove('choice');

        el.classList.add('choice');

        renderSeats(seatsArr, el.innerHTML);
    });

    reservation.addEventListener('click', () => {
        const date = dates_list.value;
        const all_seats = seats_list.querySelectorAll('.seat');
        const choice = time_list.querySelectorAll('.choice');
        const time = choice[0].innerHTML;
        const placeArr = [];

        all_seats.forEach(item => {
            if (item.getAttribute('data-occupied') === 'choice') item.setAttribute('data-occupied', 'true')
            placeArr.push({
                id: item.getAttribute('data-id'),
                occupied: item.getAttribute('data-occupied')
            });
        });

        const saveOdj = {
            date: date,
            time: time,
            places: placeArr
        };
        const tickets = searchTickets(date, time);
        let sendData;

        if (tickets) {
            const allTickets = tickets.allTickets.filter(item => {
                if (item.time === time && item.date === date)
                    return false;
                else
                    return item;
            });
             allTickets.push(saveOdj);
             sendData = allTickets;
        } else {
            sendData = [];
            sendData.push(saveOdj);
        }

        localStorage.setItem("tickets", JSON.stringify(sendData));
    })

    seats_list.addEventListener('click', (e) => {
        let el = e.target;

        if (el.getAttribute('data-occupied') === 'false') {
            el.setAttribute('data-occupied', 'choice');
        } else {
            el.setAttribute('data-occupied', 'false');
        }
    });
});