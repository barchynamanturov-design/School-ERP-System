import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const STUDENTS_BY_CLASS = {
  "1": ["Айбек Усупов","Гүлнара Матисакова","Тимур Жакыпов","Зарина Осмонова","Нурлан Бакытбеков","Айгерим Токтосунова","Даниил Ковалёв","Малика Эсенгулова","Арсен Молдоканов","Диана Асанова","Бекзат Турдукулов","Камила Рысбекова","Жолдош Мамытбеков","Айсулуу Дуйшенова","Максим Петров","Нурзат Калмаматова","Алтынай Абдиева","Эрик Сыдыков","Зульфия Маматова","Санжар Кенжебаев","Лейла Асанбекова","Руслан Джакыпов","Венера Токоева","Адилет Осмоналиев","Айдана Кыдырова"],
  "2": ["Нурсултан Бердибеков","Айнура Сатыбалдиева","Тилек Жолдошев","Гүлмира Асанова","Бакыт Калматов","Зарема Ибраимова","Алмаз Турдубеков","Камила Садыкова","Жаныбек Эсенов","Айгерим Жакшылыкова","Данияр Кочкоров","Венера Усупова","Санжар Молдоканов","Нурзат Бекова","Арсен Дуйшенов","Малика Токтосунова","Тимур Осмонов","Диана Петрова","Бекзат Кыдыров","Айсулуу Маматова","Руслан Кенжебаев","Лейла Абдиева","Адилет Джакыпов","Зульфия Калмаматова","Эрик Асанбеков"],
  "3": ["Айбек Токоев","Гүлнара Жолдошева","Тимур Бердибеков","Зарина Сатыбалдиева","Нурлан Жакыпов","Айгерим Асанова","Алмаз Калматов","Малика Ибраимова","Арсен Турдубеков","Диана Садыкова","Бекзат Эсенов","Камила Жакшылыкова","Жолдош Кочкоров","Айсулуу Усупова","Максим Молдоканов","Нурзат Бекова","Алтынай Дуйшенова","Эрик Токтосунов","Зульфия Осмонова","Санжар Петров","Лейла Кыдырова","Руслан Маматов","Венера Кенжебаева","Адилет Абдиев","Айдана Джакыпова","Данияр Асанбеков"],
  "4": ["Нурсултан Жакыпов","Айнура Токоева","Тилек Асанов","Гүлмира Бердибекова","Бакыт Сатыбалдиев","Зарема Жолдошева","Алмаз Калматов","Камила Ибраимова","Жаныбек Турдубеков","Айгерим Садыкова","Данияр Эсенов","Венера Жакшылыкова","Санжар Кочкоров","Нурзат Усупова","Арсен Молдоканов","Малика Бекова","Тимур Дуйшенов","Диана Токтосунова","Бекзат Осмонов","Айсулуу Петрова","Руслан Кыдыров","Лейла Маматова","Адилет Кенжебаев","Зульфия Абдиева","Эрик Джакыпов"],
  "5": ["Айбек Асанбеков","Гүлнара Токоева","Тимур Жолдошев","Зарина Бердибекова","Нурлан Сатыбалдиев","Айгерим Жакыпова","Алмаз Асанов","Малика Калматова","Арсен Ибраимов","Диана Турдубекова","Бекзат Садыков","Камила Эсенова","Жолдош Жакшылыков","Айсулуу Кочкорова","Максим Усупов","Нурзат Молдоканова","Алтынай Бекова","Эрик Дуйшенов","Зульфия Токтосунова","Санжар Осмонов","Лейла Петрова","Руслан Кыдыров","Венера Маматова","Адилет Кенжебаев","Айдана Абдиева","Данияр Джакыпов","Нурсултан Асанбеков"],
  "6": ["Айнура Токоева","Тилек Жолдошев","Гүлмира Бердибекова","Бакыт Сатыбалдиев","Зарема Жакыпова","Алмаз Асанов","Камила Калматова","Жаныбек Ибраимов","Айгерим Турдубекова","Данияр Садыков","Венера Эсенова","Санжар Жакшылыков","Нурзат Кочкорова","Арсен Усупов","Малика Молдоканова","Тимур Бекова","Диана Дуйшенова","Бекзат Токтосунов","Айсулуу Осмонова","Руслан Петров","Лейла Кыдырова","Адилет Маматов","Зульфия Кенжебаева","Эрик Абдиев","Айбек Джакыпов","Гүлнара Асанбекова"],
  "7": ["Нурсултан Токоев","Айнура Жолдошева","Тилек Бердибеков","Гүлмира Сатыбалдиева","Бакыт Жакыпов","Зарема Асанова","Алмаз Калматов","Камила Ибраимова","Жаныбек Турдубеков","Айгерим Садыкова","Данияр Эсенов","Венера Жакшылыкова","Санжар Кочкоров","Нурзат Усупова","Арсен Молдоканов","Малика Бекова","Тимур Дуйшенов","Диана Токтосунова","Бекзат Осмонов","Айсулуу Петрова","Руслан Кыдыров","Лейла Маматова","Адилет Кенжебаев","Зульфия Абдиева","Эрик Джакыпов","Айбек Асанбеков","Гүлнара Токоева"],
  "8": ["Тимур Жолдошев","Зарина Бердибекова","Нурлан Сатыбалдиев","Айгерим Жакыпова","Алмаз Асанов","Малика Калматова","Арсен Ибраимов","Диана Турдубекова","Бекзат Садыков","Камила Эсенова","Жолдош Жакшылыков","Айсулуу Кочкорова","Максим Усупов","Нурзат Молдоканова","Алтынай Бекова","Эрик Дуйшенов","Зульфия Токтосунова","Санжар Осмонов","Лейла Петрова","Руслан Кыдыров","Венера Маматова","Адилет Кенжебаев","Айдана Абдиева","Данияр Джакыпов","Нурсултан Асанбеков"],
  "9": ["Айнура Токоева","Тилек Жолдошев","Гүлмира Бердибекова","Бакыт Сатыбалдиев","Зарема Жакыпова","Алмаз Асанов","Камила Калматова","Жаныбек Ибраимов","Айгерим Турдубекова","Данияр Садыков","Венера Эсенова","Санжар Жакшылыков","Нурзат Кочкорова","Арсен Усупов","Малика Молдоканова","Тимур Бекова","Диана Дуйшенова","Бекзат Токтосунов","Айсулуу Осмонова","Руслан Петров","Лейла Кыдырова","Адилет Маматов","Зульфия Кенжебаева","Эрик Абдиев","Айбек Джакыпов"],
  "10": ["Гүлнара Асанбекова","Нурсултан Токоев","Айнура Жолдошева","Тилек Бердибеков","Гүлмира Сатыбалдиева","Бакыт Жакыпов","Зарема Асанова","Алмаз Калматов","Камила Ибраимова","Жаныбек Турдубеков","Айгерим Садыкова","Данияр Эсенов","Венера Жакшылыкова","Санжар Кочкоров","Нурзат Усупова","Арсен Молдоканов","Малика Бекова","Тимур Дуйшенов","Диана Токтосунова","Бекзат Осмонов","Айсулуу Петрова","Руслан Кыдыров","Лейла Маматова","Адилет Кенжебаев","Зульфия Абдиева"],
  "11": ["Эрик Джакыпов","Айбек Асанбеков","Гүлнара Токоева","Тимур Жолдошев","Зарина Бердибекова","Нурлан Сатыбалдиев","Айгерим Жакыпова","Алмаз Асанов","Малика Калматова","Арсен Ибраимов","Диана Турдубекова","Бекзат Садыков","Камила Эсенова","Жолдош Жакшылыков","Айсулуу Кочкорова","Максим Усупов","Нурзат Молдоканова","Алтынай Бекова","Эрик Дуйшенов","Зульфия Токтосунова","Санжар Осмонов","Лейла Петрова","Руслан Кыдыров","Венера Маматова","Адилет Кенжебаев"],
  "12": ["Айдана Абдиева","Данияр Джакыпов","Нурсултан Асанбеков","Айнура Токоева","Тилек Жолдошев","Гүлмира Бердибекова","Бакыт Сатыбалдиев","Зарема Жакыпова","Алмаз Асанов","Камила Калматова","Жаныбек Ибраимов","Айгерим Турдубекова","Данияр Садыков","Венера Эсенова","Санжар Жакшылыков","Нурзат Кочкорова","Арсен Усупов","Малика Молдоканова","Тимур Бекова","Диана Дуйшенова","Бекзат Токтосунов","Айсулуу Осмонова","Руслан Петров","Лейла Кыдырова"],
};

const SCHEDULE_BY_CLASS = {
  "1": [
    { day: "Понедельник", lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Чтение", startTime: "09:40" }, { subject: "Физкультура", startTime: "10:30" }] },
    { day: "Вторник",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "ИЗО", startTime: "09:40" }, { subject: "Музыка", startTime: "10:30" }] },
    { day: "Среда",       lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Чтение", startTime: "09:40" }, { subject: "Физкультура", startTime: "10:30" }] },
    { day: "Четверг",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "ИЗО", startTime: "09:40" }, { subject: "Музыка", startTime: "10:30" }] },
    { day: "Пятница",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Чтение", startTime: "09:40" }, { subject: "Физкультура", startTime: "10:30" }] },
  ],
  "2": [
    { day: "Понедельник", lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Чтение", startTime: "09:40" }, { subject: "ИЗО", startTime: "10:30" }, { subject: "Физкультура", startTime: "11:20" }] },
    { day: "Вторник",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Чтение", startTime: "09:40" }, { subject: "Музыка", startTime: "10:30" }, { subject: "ИЗО", startTime: "11:20" }] },
    { day: "Среда",       lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Чтение", startTime: "09:40" }, { subject: "Физкультура", startTime: "10:30" }, { subject: "Музыка", startTime: "11:20" }] },
    { day: "Четверг",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Чтение", startTime: "09:40" }, { subject: "ИЗО", startTime: "10:30" }, { subject: "Музыка", startTime: "11:20" }] },
    { day: "Пятница",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Чтение", startTime: "09:40" }, { subject: "Физкультура", startTime: "10:30" }, { subject: "ИЗО", startTime: "11:20" }] },
  ],
  "3": [
    { day: "Понедельник", lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "ИЗО", startTime: "10:30" }, { subject: "Физкультура", startTime: "11:20" }] },
    { day: "Вторник",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "Музыка", startTime: "10:30" }, { subject: "ИЗО", startTime: "11:20" }] },
    { day: "Среда",       lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "Физкультура", startTime: "10:30" }, { subject: "Музыка", startTime: "11:20" }] },
    { day: "Четверг",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "ИЗО", startTime: "10:30" }, { subject: "Физкультура", startTime: "11:20" }] },
    { day: "Пятница",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "Музыка", startTime: "10:30" }, { subject: "ИЗО", startTime: "11:20" }] },
  ],
  "4": [
    { day: "Понедельник", lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Физкультура", startTime: "11:20" }] },
    { day: "Вторник",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "ИЗО", startTime: "10:30" }, { subject: "Музыка", startTime: "11:20" }] },
    { day: "Среда",       lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Физкультура", startTime: "11:20" }] },
    { day: "Четверг",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "ИЗО", startTime: "10:30" }, { subject: "Музыка", startTime: "11:20" }] },
    { day: "Пятница",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Физкультура", startTime: "11:20" }] },
  ],
  "5": [
    { day: "Понедельник", lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Вторник",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "География", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Музыка", startTime: "12:10" }] },
    { day: "Среда",       lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Физкультура", startTime: "11:20" }, { subject: "ИЗО", startTime: "12:10" }] },
    { day: "Четверг",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Биология", startTime: "08:50" }, { subject: "География", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "Русский язык", startTime: "11:20" }, { subject: "Музыка", startTime: "12:10" }] },
    { day: "Пятница",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
  ],
  "6": [
    { day: "Понедельник", lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Вторник",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Биология", startTime: "08:50" }, { subject: "География", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "Русский язык", startTime: "11:20" }, { subject: "Музыка", startTime: "12:10" }] },
    { day: "Среда",       lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Физкультура", startTime: "11:20" }, { subject: "ИЗО", startTime: "12:10" }] },
    { day: "Четверг",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Биология", startTime: "08:50" }, { subject: "География", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "Русский язык", startTime: "11:20" }, { subject: "Музыка", startTime: "12:10" }] },
    { day: "Пятница",     lessons: [{ subject: "Математика", startTime: "08:00" }, { subject: "Русский язык", startTime: "08:50" }, { subject: "Литература", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
  ],
  "7": [
    { day: "Понедельник", lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Русский язык", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Вторник",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Физика", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Среда",       lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Русский язык", startTime: "09:40" }, { subject: "География", startTime: "10:30" }, { subject: "Физкультура", startTime: "11:20" }, { subject: "Литература", startTime: "12:10" }] },
    { day: "Четверг",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Физика", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "История", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Пятница",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Русский язык", startTime: "09:40" }, { subject: "География", startTime: "10:30" }, { subject: "Физкультура", startTime: "11:20" }, { subject: "Литература", startTime: "12:10" }] },
  ],
  "8": [
    { day: "Понедельник", lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Русский язык", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Вторник",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Физика", startTime: "08:50" }, { subject: "Химия", startTime: "09:40" }, { subject: "Биология", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Среда",       lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Русский язык", startTime: "09:40" }, { subject: "География", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Четверг",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Физика", startTime: "08:50" }, { subject: "Химия", startTime: "09:40" }, { subject: "Биология", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Пятница",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Русский язык", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
  ],
  "9": [
    { day: "Понедельник", lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Вторник",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Химия", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "Русский язык", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Среда",       lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "География", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Четверг",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Химия", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "Русский язык", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Пятница",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
  ],
  "10": [
    { day: "Понедельник", lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Вторник",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Химия", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Среда",       lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "Русский язык", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Четверг",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Химия", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "История", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Пятница",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "Русский язык", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
  ],
  "11": [
    { day: "Понедельник", lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Вторник",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Химия", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Среда",       lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "Русский язык", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Четверг",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Химия", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "История", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Пятница",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "Русский язык", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
  ],
  "12": [
    { day: "Понедельник", lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "История", startTime: "10:30" }, { subject: "Английский язык", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Вторник",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Химия", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Среда",       lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "Русский язык", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
    { day: "Четверг",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Химия", startTime: "08:50" }, { subject: "Биология", startTime: "09:40" }, { subject: "Английский язык", startTime: "10:30" }, { subject: "История", startTime: "11:20" }, { subject: "Информатика", startTime: "12:10" }] },
    { day: "Пятница",     lessons: [{ subject: "Алгебра", startTime: "08:00" }, { subject: "Геометрия", startTime: "08:50" }, { subject: "Физика", startTime: "09:40" }, { subject: "Русский язык", startTime: "10:30" }, { subject: "Литература", startTime: "11:20" }, { subject: "Физкультура", startTime: "12:10" }] },
  ],
};

export default function SeedData() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const addMinutes = (time, mins) => {
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + mins;
    return `${Math.floor(total / 60).toString().padStart(2, "0")}:${(total % 60).toString().padStart(2, "0")}`;
  };

  const clearCollection = async (name) => {
    const snap = await getDocs(collection(db, name));
    for (const d of snap.docs) await deleteDoc(d.ref);
  };

  const handleSeed = async () => {
    setLoading(true);
    setStatus("Очищаем старые данные...");

    await clearCollection("students");
    await clearCollection("schedule");

    setStatus("Добавляем учеников...");
    for (const [classId, names] of Object.entries(STUDENTS_BY_CLASS)) {
      for (const name of names) {
        await addDoc(collection(db, "students"), {
          name,
          userId: "",
          classId,
          parentIds: [],
          createdAt: new Date(),
        });
      }
    }

    setStatus("Добавляем расписание...");
    for (const [classId, days] of Object.entries(SCHEDULE_BY_CLASS)) {
      for (const { day, lessons } of days) {
        for (const lesson of lessons) {
          await addDoc(collection(db, "schedule"), {
            classId,
            day,
            subject: lesson.subject,
            teacher: "",
            startTime: lesson.startTime,
            endTime: addMinutes(lesson.startTime, 45),
            createdAt: new Date(),
          });
        }
      }
    }

    setStatus("✅ Готово! Все данные загружены.");
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/dashboard")}>⬅️ Главное меню</button>
      <h1>Загрузка тестовых данных</h1>
      <p>Нажмите кнопку — загрузятся все ученики (1-12 класс) и расписание.</p>
      <button
        onClick={handleSeed}
        disabled={loading}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        {loading ? "Загрузка..." : "Загрузить данные"}
      </button>
      {status && <p style={{ marginTop: "10px", color: "green" }}>{status}</p>}
    </div>
  );
}