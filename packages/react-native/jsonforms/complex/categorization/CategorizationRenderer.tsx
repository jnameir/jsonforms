import { Categorization, Category, LayoutProps } from "@jsonforms/core";
import { RendererComponent, withJsonFormsLayoutProps } from "@jsonforms/react";
import bind from "bind-decorator";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../styles";
import { renderButton } from "../../util";
import { CategorizationList } from "./CategorizationList";
import { SingleCategory } from "./SingleCategory";
import { isCategorization } from "./tester";

export interface CategorizationState {
    selectedCategory: Category;
    currentPage: number;
}

class CategorizationRenderer extends RendererComponent<
    LayoutProps,
    CategorizationState
> {
    categorization: Categorization;

    constructor(props) {
        super(props);

        this.categorization = this.props.uischema as Categorization;
        this.state = {
            selectedCategory: this.findCategory(
                this.categorization as Categorization,
            ),
            currentPage: 0,
        };
    }

    @bind
    public onCategorySelected(page: number) {
        const categorization = this.props.uischema as Categorization;

        this.setState({
            selectedCategory: categorization.elements[page] as Category,
            currentPage: page,
        });
    }

    /**
     * @inheritDoc
     */
    render() {
        const { categorization } = this;
        const { selectedCategory } = this.state;
        const withNavigation = categorization.options.variant == "navigation";

        const { currentPage } = this.state;
        const totalPages = categorization.elements.length;

        const buttonAlignment =
            currentPage + 1 === totalPages ? "flex-start" : "flex-end";

        return (
            <>
                {withNavigation && (
                    <View style={styles.navigationContainer}>
                        {this.renderNavigationStepper(categorization)}
                    </View>
                )}
                <View>
                    <SingleCategory
                        category={selectedCategory}
                        schema={this.props.schema}
                        path={this.props.path}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: buttonAlignment,
                        }}
                    >
                        {currentPage - 1 >= 0 &&
                            renderButton(
                                this.onCategorySelected.bind(
                                    this,
                                    currentPage - 1,
                                ),
                                Colors.PRIMARY_DISABLED,
                                "white",
                                "zurück",
                            )}
                        {currentPage + 1 < totalPages &&
                            renderButton(
                                this.onCategorySelected.bind(
                                    this,
                                    currentPage + 1,
                                ),
                                Colors.PRIMARY,
                                "white",
                                "weiter",
                            )}
                    </View>
                </View>
            </>
        );
    }

    private renderNavigationStepper(categorization) {
        return (
            <CategorizationList
                categorization={categorization}
                selectedPage={this.state.currentPage}
                onSelect={this.onCategorySelected}
            />
        );
    }

    private findCategory(categorization: Categorization): Category {
        const category = categorization.elements[0];

        if (this.state?.selectedCategory) {
            return this.state.selectedCategory as Category;
        }

        if (isCategorization(category)) {
            return this.findCategory(category);
        }

        return category;
    }
}

export default withJsonFormsLayoutProps(CategorizationRenderer);

const styles = StyleSheet.create({
    navigationContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        marginRight: 20,
    },
});
