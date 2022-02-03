import { ElementType, ReactElement } from "react";
import renderer, {
    ReactTestInstance,
    ReactTestRenderer
} from "react-test-renderer";

export interface BetterReactTestInstance<T> {
    instance: T;
    type: ElementType;
    props: { [propName: string]: any };
    parent: null | ReactTestInstance;
    children: Array<ReactTestInstance | string>;

    find(predicate: (node: ReactTestInstance) => boolean): ReactTestInstance;

    findByType(type: any): ReactTestInstance;

    findByProps(props: { [propName: string]: any }): ReactTestInstance;

    findAll(
        predicate: (node: ReactTestInstance) => boolean,
        options?: { deep: boolean },
    ): ReactTestInstance[];

    findAllByType(type: any, options?: { deep: boolean }): ReactTestInstance[];

    findAllByProps(
        props: { [propName: string]: any },
        options?: { deep: boolean },
    ): ReactTestInstance[];
}

export class SimpleTestRenderer<T> {
    private testInstance: ReactTestRenderer;
    private readonly createElement: () => any;

    constructor(createElement: () => any) {
        this.createElement = createElement;
    }

    public create() {
        const element = this.createComplete();

        let comp = null;

        void renderer.act(() => {
            comp = renderer.create(element);
        });

        this.testInstance = comp;
    }

    /**
     * Updates the component tree (including root props).
     *
     * @param updatedInstance Optional. If populated, the provided instance will be used
     * to update the component tree.
     */
    public update(updatedInstance: ReactElement<any> = null) {
        const element = this.createComplete(updatedInstance);

        this.testInstance.update(element);
    }

    private createComplete(updatedInstance: ReactElement<any> = null) {
        const element = updatedInstance || this.createElement();

        return element;
    }

    public get instance(): BetterReactTestInstance<T> {
        const inst = this.testInstance.root as ReactTestInstance;
        if (inst.instance === null) {
            // some times its null
            return inst.children[0] as ReactTestInstance;
        }

        return inst;
    }

    public get root(): BetterReactTestInstance<T> {
        return this.testInstance.root as any;
    }

    public get json() {
        return this.testInstance.toJSON();
    }
}

export function render<T>(createElement: () => any): SimpleTestRenderer<T> {
    const r = new SimpleTestRenderer<T>(createElement);
    r.create();

    return r;
}
