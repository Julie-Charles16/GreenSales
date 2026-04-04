// src/test.js
const { PrismaClient } = require('./generated/prisma'); // CommonJS
const prisma = new PrismaClient();

// Enum correspondants à ton schema
const ClientStatus = {
  PROSPECT: "PROSPECT",
  NEGOCIATION: "NEGOCIATION",
  DEVIS_ENVOYE: "DEVIS_ENVOYE",
  SIGNE: "SIGNE",
  PERDU: "PERDU",
};

const AppointmentStatus = {
  PLANIFIE: "PLANIFIE",
  TERMINE: "TERMINE",
  ANNULE: "ANNULE",
};

const SaleStatus = {
  EN_ATTENTE: "EN_ATTENTE",
  ANNULEE: "ANNULEE",
  TERMINEE: "TERMINEE",
};

async function testDB() {
  try {
    console.log('--- USERS ---');
    let users = await prisma.user.findMany();
    console.log(users);

    // Création user admin si non existant
    let admin = await prisma.user.findUnique({ where: { email: 'admin@test.com' } });
    if (!admin) {
      admin = await prisma.user.create({
        data: { pseudo: 'admin', email: 'admin@test.com', password: '1234' },
      });
      console.log('✅ User créé:', admin);
    }

    console.log('--- CLIENTS ---');
    let clients = await prisma.client.findMany();
    console.log(clients);

    // Création client si non existant
    let client = await prisma.client.findUnique({ where: { email: 'jean.dupont@test.com' } });
    if (!client) {
      client = await prisma.client.create({
        data: {
          name: 'Dupont',
          firstName: 'Jean',
          address: '10 rue de Paris',
          city: 'Paris',
          postalCode: '75000',
          email: 'jean.dupont@test.com',
          phone: '0600000000',
          projectType: 'Panneaux solaires',
          status: ClientStatus.PROSPECT,
          userId: admin.id,
        },
      });
      console.log('✅ Client créé:', client);
    }

    console.log('--- APPOINTMENTS ---');
    let appointments = await prisma.appointment.findMany();
    console.log(appointments);

    // Création appointment si non existant
    let appointmentExists = await prisma.appointment.findFirst({
      where: { clientId: client.id, userId: admin.id, comment: 'Rendez-vous test' },
    });
    if (!appointmentExists) {
      const appointment = await prisma.appointment.create({
        data: {
          date: new Date(),
          status: AppointmentStatus.PLANIFIE,
          comment: 'Rendez-vous test',
          clientId: client.id,
          userId: admin.id,
        },
      });
      console.log('✅ Appointment créé:', appointment);
    }

    console.log('--- SALES ---');
    let sales = await prisma.sale.findMany();
    console.log(sales);

    // Création sale si non existante
    let saleExists = await prisma.sale.findFirst({
      where: { clientId: client.id, userId: admin.id, amount: 1000 },
    });
    if (!saleExists) {
      const sale = await prisma.sale.create({
        data: {
          amount: 1000.0,
          commission: 100.0,
          status: SaleStatus.EN_ATTENTE,
          signedAt: new Date(),
          clientId: client.id,
          userId: admin.id,
        },
      });
      console.log('✅ Sale créé:', sale);
    }

    console.log('✅ Test DB terminé avec succès !');
  } catch (err) {
    console.error('❌ Erreur DB:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();