import { AppDataSource } from "../database/data-source";
import { Role } from "../modules/users/entities/role.entity";
import { RoleName } from "../modules/users/entities/role.enums";

const roles = [
  {
    name: RoleName.CUSTOMER,
    description: "Can browse vehicles, make bookings and leave reviews",
  },
  {
    name: RoleName.CAR_OWNER,
    description: "Can register vehicles, manage bookings and receive earnings",
  },
  {
    name: RoleName.ADMIN,
    description: "Can manage users, vehicles, payments and withdrawals",
  },
];

export const seedRoles = async (): Promise<void> => {
  const roleRepository = AppDataSource.getRepository(Role);

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({
      where: {
        name: roleData.name,
      },
    });

    if (existingRole) {
      existingRole.description = roleData.description;
      await roleRepository.save(existingRole);

      console.log(`Role already exists: ${roleData.name}`);
      continue;
    }

    const role = roleRepository.create(roleData);

    await roleRepository.save(role);

    console.log(`Created role: ${roleData.name}`);
  }
};
