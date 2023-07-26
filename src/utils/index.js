import {getMonth} from "date-fns";

const weekDays = [
	{
		name: "Понедельник",
		shortName: "Пн",
		visible: true,
	},
	{
		name: "Вторник",
		shortName: "Вт",
		visible: false,
	},
	{
		name: "Среда",
		shortName: "Ср",
		visible: true,
	},
	{
		name: "Четверг",
		shortName: "Чт",
		visible: false,
	},
	{
		name: "Пятница",
		shortName: "Пт",
		visible: true,
	},
	{
		name: "Суббота",
		shortName: "Сб",
		visible: false,
	},
	{
		name: "Воскресенье",
		shortName: "Вс",
		visible: false,
	},
];

const months = [
	{
		name: "Январь",
		shortName: "Янв.",
	},
	{
		name: "Февраль",
		shortName: "Февр.",
	},
	{
		name: "Март",
		shortName: "Мар.",
	},
	{
		name: "Апрель",
		shortName: "Апр.",
	},
	{
		name: "Май",
		shortName: "Май",
	},
	{
		name: "Июнь",
		shortName: "Июнь",
	},
	{
		name: "Июль",
		shortName: "Июль",
	},
	{
		name: "Август",
		shortName: "Авг.",
	},
	{
		name: "Сентябрь",
		shortName: "Сент.",
	},
	{
		name: "Октябрь",
		shortName: "Окт.",
	},
	{
		name: "Ноябрь",
		shortName: "Нояб.",
	},
	{
		name: "Декабрь",
		shortName: "Дек.",
	},
];

const getMonthsBetweenDates = (startDate, endDate) => {
	const months = [];
	const date = new Date(startDate);

	while (date < endDate) {
		months.push(getMonth(date));
		date.setMonth(date.getMonth() + 1);
	}
	return months;
};

export {weekDays, months,getMonthsBetweenDates};