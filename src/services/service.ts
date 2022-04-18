import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

// card services

export async function createCard(newCard: any) {
  await validateCardType(newCard.cardType, newCard.employeeId);
  const employeeFullName = await findEmployee(newCard.employeeId);
  const employeeNames = employeeFullName.split(" ");

  const cardholderName = employeeNames
    .map((name) => {
      if (name.length > 2) return name.toUpperCase();
    })
    .join(" ")
    .split(" ")
    .join(" ");

  const { number, securityCode, expirationDate } = createCardData();

  await cardRepository.insert({
    employeeId: newCard.employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    isVirtual: false,
    isBlocked: true,
    type: newCard.cardType,
  });
}

function createCardData() {
  const cardNumber = faker.finance.creditCardNumber("mastercard");
  const securityCode = faker.finance.creditCardCVV();
  const hashedSecurityCode = bcrypt.hashSync(securityCode, 10);
  const expirationDate = dayjs().add(5, "year").format("MM/YY");

  console.log(securityCode);

  return {
    number: cardNumber,
    securityCode: hashedSecurityCode,
    expirationDate,
  };
}

async function validateCardType(
  type: cardRepository.TransactionTypes,
  employeeId: number
) {
  const cardTypeAlreadyExists = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );
  if (cardTypeAlreadyExists) throw conflictError("card type");
}

async function findEmployee(id: number) {
  const employee = await employeeRepository.findById(id);
  if (!employee) throw notFoundError("employee");

  return employee.fullName;
}

export async function activateCard(id: number, cardData: any) {
  const card = await cardRepository.findById(id);
  if (!card) throw notFoundError("card id");
  if (card.password) throw conflictError("card already has password");
  if (dayjs(card.expirationDate).isBefore(dayjs().format("DD/MM")))
    throw conflictError("expired card");
  if (!card.isBlocked) throw conflictError("card already active");
  if (!bcrypt.compareSync(cardData.securityCode, card.securityCode))
    throw conflictError("CVC is wrong");

  delete cardData.securityCode;

  const hashedPassword = bcrypt.hashSync(cardData.password, 10);

  await cardRepository.update(id, {
    ...cardData,
    isBlocked: false,
    password: hashedPassword,
  });
}

export async function getBalance(id: number) {
  const cardData = await cardRepository.findById(id);
  if (!cardData) throw notFoundError("card");

  const payments = await paymentRepository.findByCardId(id);
  const recharges = await rechargeRepository.findByCardId(id);

  let balance: number = 0;

  for (let i = 0; i < payments.length; i++) {
    balance = balance - payments[i].amount;
  }

  for (let i = 0; i < recharges.length; i++) {
    balance = balance + recharges[i].amount;
  }

  return { balance, payments, recharges };
}

export async function rechargeCard(id: number, amount: number) {
  const cardData = await cardRepository.findById(id);
  if (!cardData) throw notFoundError("card id");
  if (dayjs(cardData.expirationDate).isBefore(dayjs().format("DD/MM")))
    throw conflictError("expired card");

  const rechargeData = {
    cardId: id,
    amount: amount,
  };

  await rechargeRepository.insert(rechargeData);
}

//errors

function conflictError(entity: string) {
  return {
    type: "error_conflict",
    message: `"${entity}" already exists`,
  };
}

function notFoundError(entity: string) {
  return {
    type: "error_not_found",
    message: `Could not find specified "${entity}"`,
  };
}

function unauthorizedError(entity: string) {
  return {
    type: "error_unauthorized",
    message: `Invalid "${entity}"`,
  };
}

//company services

export async function validateKey(apiKey: string) {
  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) throw unauthorizedError("api key");

  return company;
}
