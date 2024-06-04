import { HTMLAttributes } from "react";

export type IconVerificatedProps = HTMLAttributes<SVGElement>;

export function IconVerificated(props: Readonly<IconVerificatedProps>) {
    return <svg {...props} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="icon-verificated">
            { props.title &&
                <title>{props.title}</title>
            }
            <g id="Group 4">
                <rect id="Rectangle 46" x="5.85791" y="5.85785" width="28.2843" height="28.2843" rx="5" fill="var(--primary-color)" />
                <path id="Rectangle 47"
                    d="M16.4341 3.54205C18.3831 1.58583 21.549 1.57999 23.5052 3.52901L36.458 16.4341C38.4142 18.3831 38.42 21.5489 36.471 23.5052L23.5659 36.458C21.6169 38.4142 18.4511 38.42 16.4949 36.471L3.54207 23.5659C1.58585 21.6169 1.58001 18.4511 3.52903 16.4948L16.4341 3.54205Z"
                    fill="var(--primary-color)" />
            </g>
            <g id="Group 3">
                <path id="Line 8"
                    d="M12.578 19.7615C12.1273 19.4423 11.5032 19.5488 11.184 19.9995C10.8647 20.4502 10.9713 21.0743 11.422 21.3935L12.578 19.7615ZM11.422 21.3935L19.0724 26.8126L20.2285 25.1805L12.578 19.7615L11.422 21.3935Z"
                    fill="white" />
                <path id="Line 9" d="M27 15L19.3138 25.8362" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </g>
        </g>
    </svg>
}
