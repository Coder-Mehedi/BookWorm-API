import {MigrationInterface, QueryRunner} from "typeorm";

export class prod1630399417256 implements MigrationInterface {
    name = 'prod1630399417256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`book-worm\`.\`user\` (\`id\` char(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_638bac731294171648258260ff\` (\`password\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`book-worm\`.\`rating\` (\`id\` char(36) NOT NULL, \`point\` int NOT NULL, \`userId\` char(36) NULL, \`bookId\` char(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`book-worm\`.\`book\` (\`id\` char(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`author\` varchar(255) NOT NULL, \`publishedYear\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`avgRating\` decimal(5,2) NOT NULL DEFAULT '0.00', \`userId\` char(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`book-worm\`.\`rating\` ADD CONSTRAINT \`FK_a6c53dfc89ba3188b389ef29a62\` FOREIGN KEY (\`userId\`) REFERENCES \`book-worm\`.\`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book-worm\`.\`rating\` ADD CONSTRAINT \`FK_2ab7f7fc5b63b0147591ba69032\` FOREIGN KEY (\`bookId\`) REFERENCES \`book-worm\`.\`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book-worm\`.\`book\` ADD CONSTRAINT \`FK_04f66cf2a34f8efc5dcd9803693\` FOREIGN KEY (\`userId\`) REFERENCES \`book-worm\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`book-worm\`.\`book\` DROP FOREIGN KEY \`FK_04f66cf2a34f8efc5dcd9803693\``);
        await queryRunner.query(`ALTER TABLE \`book-worm\`.\`rating\` DROP FOREIGN KEY \`FK_2ab7f7fc5b63b0147591ba69032\``);
        await queryRunner.query(`ALTER TABLE \`book-worm\`.\`rating\` DROP FOREIGN KEY \`FK_a6c53dfc89ba3188b389ef29a62\``);
        await queryRunner.query(`DROP TABLE \`book-worm\`.\`book\``);
        await queryRunner.query(`DROP TABLE \`book-worm\`.\`rating\``);
        await queryRunner.query(`DROP INDEX \`IDX_638bac731294171648258260ff\` ON \`book-worm\`.\`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`book-worm\`.\`user\``);
        await queryRunner.query(`DROP TABLE \`book-worm\`.\`user\``);
    }

}
