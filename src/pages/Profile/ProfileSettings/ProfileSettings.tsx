import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as RadioGroup from '@radix-ui/react-radio-group'
import './ProfileSettings.css'

type DropdownOption = {
    name: string;
    apiValue: string;
};

type SocialOption = DropdownOption & {
    iconName: string
};

export type ProfileSettingsProps = {
    genderOptions: DropdownOption[];
    pronounsOptions: DropdownOption[];
    socialOptions: SocialOption[];
};

export function ProfileSettings(props: ProfileSettingsProps) {
    return (
        <div id="profile-settings">
            <div className="heading">Editar meu perfil</div>

            <form action="" className="settings-form">
                <div className="section name">
                    <h2>Nome</h2>
                    <input id="name" type="text" placeholder='Insira seu nome e sobrenome' />
                </div>

                <div className="section biography">
                    <h2>Biografia</h2>
                    <textarea name="biography" id="biography" placeholder='Escreva um pouco sobre você' />
                </div>

                <div className="section gender">
                    <h2>Gênero</h2>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="dropdown-trigger">
                                <h4>Selecione o seu gênero</h4>
                                <img src="/assets/icons/chevron-down-1.svg" className="dropdown-icon" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className='dropdown-content'>
                                <RadioGroup.Root name='gender'>
                                    {
                                        props.genderOptions.map(gender => {
                                            return (
                                                <RadioGroup.Item className='radio-group-item' key={gender.apiValue} value={gender.apiValue}>
                                                    { gender.name }
                                                </RadioGroup.Item>
                                            );
                                        })
                                    }
                                </RadioGroup.Root>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>

                <div className="section pronouns">
                    <h2>Pronomes</h2>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="dropdown-trigger">
                                <h4>Selecione os seus pronomes</h4>
                                <img src="/assets/icons/chevron-down-1.svg" className="dropdown-icon" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className='dropdown-content'>
                                <RadioGroup.Root name='gender'>
                                    {
                                        props.pronounsOptions.map(pronoun => {
                                            return (
                                                <RadioGroup.Item className='radio-group-item' key={pronoun.apiValue} value={pronoun.apiValue}>
                                                    { pronoun.name }
                                                </RadioGroup.Item>
                                            );
                                        })
                                    }
                                </RadioGroup.Root>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>

                <div className="section social">
                    <h2>Redes Sociais</h2>
                    <div className="box">
                        {
                            props.socialOptions.map(social => {
                                return (
                                    <div className="item" key={social.apiValue}>
                                        <img src={`/assets/icons/${social.iconName}.svg`} alt={social.name} />
                                        <input type="text" name={social.apiValue} placeholder='Insira seu usuário' />
                                    </div>
                                );
                            })
                        }
                        {/* <div className="item">
                            <img src="/" alt="Facebook" className="icon" />
                            <input type="text" name='facebook' />
                        </div>
                        <div className="item">
                            <img src="/" alt="Github" className="icon" />
                            <input type="text" name='github' />
                        </div>
                        <div className="item">
                            <img src="/" alt="instagram" className="icon" />
                            <input type="text" name='instagram' />
                        </div>
                        <div className="item">
                            <img src="/" alt="LinkedIn" className="icon" />
                            <input type="text" name='linkedin' />
                        </div> */}
                    </div>
                </div>

                <div className="section submit">
                    <button type='button' className="cancel">Cancelar alterações</button>
                    <button type='button' className="submit">Salvar alterações</button>
                </div>
            </form>
        </div>
    );
}
