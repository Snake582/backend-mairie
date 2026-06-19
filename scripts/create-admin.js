const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { UsersService } = require('../dist/users/users.service');
const { Role } = require('../dist/users/enums/role.enum');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const fullName = process.env.DEFAULT_ADMIN_FULL_NAME;
  const phone = process.env.DEFAULT_ADMIN_PHONE;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!email || !fullName || !phone || !password) {
    console.warn('[create-admin] DEFAULT_ADMIN_* variables are not fully set. Skipping admin creation.');
    await app.close();
    return;
  }

  const existing = await usersService.findByEmailWithPassword(email);

  if (existing) {
    console.log(`[create-admin] Admin user ${email} already exists.`);
    await app.close();
    return;
  }

  await usersService.create({
    fullName,
    email,
    phone,
    password,
    role: Role.ADMIN,
  });

  console.log(`[create-admin] Admin user ${email} created successfully.`);
  await app.close();
}

bootstrap().catch((err) => {
  console.error('[create-admin] Failed to create admin:', err);
  process.exit(1);
});
