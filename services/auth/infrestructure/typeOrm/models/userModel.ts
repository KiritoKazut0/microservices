import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('users')
export class UserModel {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'varchar', length: 30, nullable: false})
    name: string;

    @Column({type: 'varchar', length: 50, nullable: false, unique: true})
    email: string;

    @Column({type: 'varchar', length: 30, nullable: false})
    password: string;

}