import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
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
