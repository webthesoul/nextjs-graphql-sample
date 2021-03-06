import React from "react";

import { MeQuery } from "@generated/apolloComponents";
import redirect from "@utils/redirect";

import { NextContextWithApollo } from "../interfaces/NextContextWithApollo";

import { meQuery } from "@graphql/user/queries/me";

export const withAuth = <T extends object>(
  C: React.ComponentClass<T> | React.FC
) => {
  return class AuthComponent extends React.Component<T> {
    public static async getInitialProps({
      apolloClient,
      ...ctx
    }: NextContextWithApollo) {
      try {
        const response = await apolloClient.query<MeQuery>({ query: meQuery });

        if (!response || !response.data || !response.data.me) {
          redirect(ctx, "/login");
        }

        return {
          me: response.data.me
        };
      } catch (error) {
        console.error(error);

        redirect(ctx, "/login");
      }

      return {
        me: null
      };
    }

    public render() {
      return <C {...this.props} />;
    }
  };
};
