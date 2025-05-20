import { Request, Response } from 'express';
import { findContactsByEmailOrPhone, createContact } from '../models/contactModel';

export const identifyContact = async (req: Request, res: Response): Promise<void> => {
try {
const { email, phoneNumber } = req.body;
if (!email && !phoneNumber) {
  res.status(400).json({ error: "email or phoneNumber required" });
  return;
}

const existingContacts = await findContactsByEmailOrPhone(email, phoneNumber);

// If no existing contacts, create a new primary contact
if (existingContacts.length === 0) {
  const newContact = await createContact(email, phoneNumber, null, 'primary');
  res.json({
    contact: {
      primaryContactId: newContact.id,
      emails: [newContact.email],
      phoneNumbers: [newContact.phoneNumber],
      secondaryContactIds: []
    }
  });
  return;
}

// Consolidate all contacts
let primary = existingContacts.find(c => c.linkprecedence === 'primary') || existingContacts[0];
const emails = new Set<string>();
const phones = new Set<string>();
const secondaryIds: number[] = [];

for (const contact of existingContacts) {
  if (contact.email) emails.add(contact.email);
  if (contact.phonenumber) phones.add(contact.phonenumber);
  if (contact.id !== primary.id) secondaryIds.push(contact.id);
}

const existingEmails = existingContacts.map(c => c.email);
const existingPhones = existingContacts.map(c => c.phonenumber);

if ((email && !existingEmails.includes(email)) || (phoneNumber && !existingPhones.includes(phoneNumber))) {
  const newSecondary = await createContact(email, phoneNumber, primary.id, 'secondary');
  secondaryIds.push(newSecondary.id);
  if (email) emails.add(email);
  if (phoneNumber) phones.add(phoneNumber);
}

res.json({
  contact: {
    primaryContactId: primary.id,
    emails: Array.from(emails),
    phoneNumbers: Array.from(phones),
    secondaryContactIds: secondaryIds
  }
});
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
  }
  };












