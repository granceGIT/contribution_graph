<template>
    <div class="contribution-graph" v-if="pastYearWeekDays.length">
        <table class="contribution-table" ref="table">
            <thead class="table-head">
            <tr>
                <td>
                    <span class="sr-only">День недели</span>
                </td>
                <td v-for="month in pastMonths" :key="month" class="contribution-label"
                    :colspan="countMonthMondays(month)">
                    <span class="sr-only">{{ months[month].name }}</span>
                    <span>{{ months[month].shortName }}</span>
                </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="{weekDay,dates} in pastYearWeekDays" :key="weekDay.name">
                <td class="contribution-label">
                    <span class="sr-only">{{ weekDay.name }}</span>
                    <span class="week-day" :class="{visible:weekDay.visible}">{{ weekDay.shortName }}</span>
                </td>
                <td v-for="{date,contributions} in dates" :key="date" class="contribution-date progress-box"
                    :class="{selected:selected===date}"
                    :data-level="getContributionLevel(parseInt(contributions))"
                    @click="selected=date">
                <span class="sr-only">
                    <span>{{ contributions }} contributions</span>
                    <span class="text-muted">{{ format(date, "dd.MM.yyyy") }}</span>
                </span>

                </td>
            </tr>
            </tbody>
        </table>
        <div class="contribution-graph-description">
            <span class="text-muted">Меньше</span>
            <div class="progress-box"
                 data-level="0"
                 :class="{selected:selected===0}"
                 @click="selected=0"
            >
                <span class="sr-only">0 contributions</span>
            </div>
            <div class="progress-box"
                 :class="{selected:selected===1}"
                 @click="selected=1"
                 data-level="1"
            >
                <span class="sr-only">1-9 contributions</span>
            </div>
            <div class="progress-box"
                 :class="{selected:selected===2}"
                 @click="selected=2"
                 data-level="2"
            >
                <span class="sr-only">10-19 contributions</span>
            </div>
            <div class="progress-box"
                 :class="{selected:selected===3}"
                 @click="selected=3"
                 data-level="3"
            >
                <span class="sr-only">20-29 contributions</span>
            </div>
            <div class="progress-box"
                 :class="{selected:selected===4}"
                 @click="selected=4"
                 data-level="4"
            >
                <span class="sr-only">30+ contributions</span>
            </div>
            <span class="text-muted">Больше</span>
        </div>
    </div>
</template>

<script async setup>
import {months, getMonthsBetweenDates, weekDays} from "@/utils";
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {format, getDay, nextMonday, subWeeks} from "date-fns";
import axios from "axios";

const selected = ref(null);
const table = ref(null);
const contributions = ref([]);
const today = new Date();
const pastYearWeekDays = ref([]);
const pastMonths = getMonthsBetweenDates(subWeeks(today, 50), today);

const getContributionLevel = (contributions) => {
	if (contributions < 1) return 0;
	else if (contributions < 10) return 1;
	else if (contributions < 20) return 2;
	else if (contributions < 30) return 3;
	else return 4;
};

// Используется для корректного отображения подписей месяцев на графе
const countMonthMondays = (month) => {
	if (pastYearWeekDays.value.length) {
      // Считаем количество понедельников в месяце соответствующему номеру месяца переданному в функцию
		return pastYearWeekDays.value[0].dates.filter(({date}) => date.getMonth() === month).length;
	}
	return 0;
};

// Используется для преобразования к нужному формату
const formatDates = (startDate, endDate, contribDates = []) => {
	startDate = nextMonday(new Date(startDate)); // Начинаем отсчет от понедельника, для удобств отрисовки ячеек на графе
	const date = startDate;
	const dates = [];

	while (date <= endDate) {
		const formattedDate = format(date, "yyyy-MM-dd");
		const contributions = contribDates[formattedDate] ?? 0; // Получаем количество контрибьютов по дате если они есть
		const dateContributions = {
			date: new Date(date),
			contributions,
		};

		// В библиотеке date-fns 1 - Понедельник, 0 - Воскресенье.
		let weekDay = getDay(date) ? getDay(date) - 1 : 6; // Здесь переопределено, что воскресенье будет обозначать 6
		if (dates[weekDay]) {// Проверяем на наличие дня недели в массиве, если есть добавляем дату, а иначе добавляем новый день недели
			dates[weekDay].dates.push(dateContributions);
		} else {
			dates[weekDay] = {
				weekDay: weekDays[weekDay],
				dates: [dateContributions],
			};
		}
		date.setDate(date.getDate() + 1);
	}

	return dates;
};

await axios.get(process.env.VUE_APP_CONTRIBUTIONS_URL) // Получаем список контрибьютов по дате
	.then(({data}) => {
		contributions.value = data;
		pastYearWeekDays.value = formatDates(subWeeks(today, 51), today, data);
	})
	.catch(e => {
		alert(e.message);
	});

onClickOutside(table, () => {
	selected.value = {};
});
</script>

<style scoped>
.contribution-graph {
    max-width: 1200px;
    margin: 0 auto;
}

.contribution-table {
    position: relative;
    width: max-content;
    border-collapse: separate;
}

.contribution-table .table-head {
    display: table-header-group;
    width: 100%;
    vertical-align: middle;
    height: 20px;
}

.contribution-graph-description {
    margin-top: 20px;
    padding: 20px;
    align-self: start;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 3px;
}

/* Не отображаемая информация */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

.week-day {
    visibility: hidden;
}

.week-day.visible {
    visibility: visible;
}

/* Стили ячейки */
.progress-box {
    margin: 0;
    padding: 0;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all .3s;
    position: relative;
}

/* Цвет ячейки в зависимости от уровня */
.progress-box[data-level="0"] {
    background-color: #EDEDED;
}

.progress-box[data-level="1"] {
    background-color: #ACD5F2;
}

.progress-box[data-level="2"] {
    background-color: #7FA8C9;
}

.progress-box[data-level="3"] {
    background-color: #527BA0;
}

.progress-box[data-level="4"] {
    background-color: #254E77;
}

.contribution-date:hover {
    border-color: rgba(0, 0, 0, .5);
}

.contribution-date.selected {
    border-color: rgba(0, 0, 0, .9);
}

/* Всплывающее окно при выборе ячейки */
.progress-box.selected .sr-only {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -110%);
    overflow: visible;
    z-index: 1;
    clip: unset;

    width: max-content;
    height: max-content;
    padding: 1em;
    border-radius: .25em;
    font-size: 12px;
    cursor: auto;

    background-color: #000;
    color: #fff;
}


/* Треугольник помечающий к какому ячейке относится отображенная информация */
.progress-box.selected .sr-only::after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 90%);
    border: 10px solid transparent;
    border-top: 10px solid #000;
}


/* Подписи месяцев и дней недели */
.contribution-label {
    padding: .2em .5em .2em 0;
    font-size: 12px;
    position: relative;
    color: #959494;
}

.text-muted {
    color: #7C7C7C;
}
</style>